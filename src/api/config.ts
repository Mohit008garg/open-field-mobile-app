import { Platform } from 'react-native';

/**
 * Base URL of the Open Field backend.
 *
 * Override with EXPO_PUBLIC_API_BASE_URL (e.g. your LAN IP or a deployed host).
 * Defaults are sensible for local dev:
 *   - Android emulator reaches the host machine on 10.0.2.2
 *   - iOS simulator / web reach it on localhost
 */
function defaultBaseUrl(): string {
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? defaultBaseUrl();
