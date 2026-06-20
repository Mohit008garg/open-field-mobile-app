import { Platform } from 'react-native';
import { apiRequest } from './client';
import { AuthResponse } from './types';
import { clearTokens, getTokens } from './tokenStore';

function deviceLabel(): string {
  return `${Platform.OS} ${Platform.Version ?? ''}`.trim();
}

/**
 * Exchange a Google ID token (from native sign-in) for an app session.
 * The backend verifies the token, upserts the user and returns our JWT pair.
 */
export function signInWithGoogle(idToken: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/google', {
    method: 'POST',
    body: { idToken, deviceInfo: deviceLabel() },
  });
}

/** Invalidate the current session on the server (best-effort). */
export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST', auth: true });
  } catch {
    // ignore network/expiry errors — we clear local tokens regardless
  } finally {
    await clearTokens();
  }
}

export { getTokens };
