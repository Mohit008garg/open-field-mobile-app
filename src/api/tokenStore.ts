import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Secure persistence for the app's auth tokens. On native this uses the
 * device keystore/keychain; on web it falls back to localStorage (SecureStore
 * is unavailable there).
 */

const ACCESS_KEY = 'of.accessToken';
const REFRESH_KEY = 'of.refreshToken';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const webStore = {
  get: (k: string) =>
    typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null,
  set: (k: string, v: string) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(k, v);
  },
  del: (k: string) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(k);
  },
};

// SecureStore is native-only; fall back to localStorage on web.
const isWeb = Platform.OS === 'web';

async function getItem(key: string): Promise<string | null> {
  if (isWeb) return webStore.get(key);
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) return webStore.set(key, value);
  return SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) return webStore.del(key);
  return SecureStore.deleteItemAsync(key);
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    setItem(ACCESS_KEY, tokens.accessToken),
    setItem(REFRESH_KEY, tokens.refreshToken),
  ]);
}

export async function getTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    getItem(ACCESS_KEY),
    getItem(REFRESH_KEY),
  ]);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export async function clearTokens(): Promise<void> {
  await Promise.all([deleteItem(ACCESS_KEY), deleteItem(REFRESH_KEY)]);
}
