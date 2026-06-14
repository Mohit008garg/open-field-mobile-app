import { Platform } from 'react-native';

/** Backend global route prefix (NestJS `app.setGlobalPrefix('v1')`). */
const API_PREFIX = '/v1';

/**
 * Host of the Open Field backend (scheme + host + port, no path).
 *
 * Override with EXPO_PUBLIC_API_BASE_URL (e.g. your LAN IP or a deployed host).
 * Defaults are sensible for local dev:
 *   - Android emulator reaches the host machine on 10.0.2.2
 *   - iOS simulator / web reach it on localhost
 */
function defaultHost(): string {
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
}

const host = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? defaultHost();

/** Full API base, including the `/v1` prefix — e.g. http://10.0.2.2:3000/v1 */
export const API_BASE_URL = `${host}${API_PREFIX}`;
