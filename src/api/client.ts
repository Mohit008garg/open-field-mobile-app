import { API_BASE_URL } from './config';
import { ApiError } from './types';
import { clearTokens, getTokens, saveTokens } from './tokenStore';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** JSON-serialisable request body. */
  body?: unknown;
  /** Attach the bearer access token and retry once after refresh on 401. */
  auth?: boolean;
}

/**
 * The backend wraps every success response in `{ success: true, data: ... }`
 * (ResponseTransformInterceptor). Unwrap it so callers get the payload directly.
 */
function unwrap<T>(body: unknown): T {
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    (body as { success: unknown }).success === true &&
    'data' in body
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}

async function parseError(res: Response): Promise<ApiError> {
  let message = `Request failed (${res.status})`;
  let code: string | undefined;
  try {
    const data = await res.json();
    message = data.message ?? message;
    code = data.error;
  } catch {
    // non-JSON body — keep the default message
  }
  return new ApiError(message, res.status, code);
}

async function rawFetch(path: string, options: RequestOptions, accessToken?: string) {
  const { body, auth: _auth, headers, ...rest } = options;
  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/** Exchange the stored refresh token for a fresh token pair. */
async function tryRefresh(): Promise<string | null> {
  const tokens = await getTokens();
  if (!tokens) return null;

  const res = await rawFetch('/auth/token/refresh', {
    method: 'POST',
    body: { refreshToken: tokens.refreshToken },
  });

  if (!res.ok) {
    await clearTokens();
    return null;
  }

  const next = unwrap<{ accessToken: string; refreshToken: string }>(await res.json());
  await saveTokens(next);
  return next.accessToken;
}

/**
 * Typed JSON fetch against the backend. When `auth: true` it attaches the
 * access token and, on a 401, transparently refreshes once and retries.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let accessToken: string | undefined;
  if (options.auth) {
    accessToken = (await getTokens())?.accessToken;
  }

  let res = await rawFetch(path, options, accessToken);

  if (res.status === 401 && options.auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await rawFetch(path, options, refreshed);
    }
  }

  if (!res.ok) throw await parseError(res);

  if (res.status === 204) return undefined as T;
  return unwrap<T>(await res.json());
}

/**
 * Multipart upload (images). Leaves Content-Type unset so React Native sets the
 * multipart boundary. Attaches the bearer token and refreshes once on 401.
 */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const doFetch = (token?: string) =>
    fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

  const token = (await getTokens())?.accessToken;
  let res = await doFetch(token);
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) res = await doFetch(refreshed);
  }
  if (!res.ok) throw await parseError(res);
  return unwrap<T>(await res.json());
}
