import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Tiny AsyncStorage-backed cache with a TTL. Used to hydrate screens instantly
 * from the last known value while a fresh network fetch runs in the background.
 */
interface Entry<T> {
  value: T;
  expiresAt: number;
}

const PREFIX = 'cache:';

export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Entry<T>;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      await AsyncStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, value: T, ttlMs = 5 * 60 * 1000): Promise<void> {
  try {
    const entry: Entry<T> = { value, expiresAt: Date.now() + ttlMs };
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // best-effort cache; ignore write failures
  }
}

export async function clearCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}
