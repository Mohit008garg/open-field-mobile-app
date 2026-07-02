import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getMyProfile, type PlayerProfile } from '@/api/profile';
import { readCache, writeCache, clearCache } from '@/api/cache';
import { ApiError } from '@/api';
import { useAuth } from './AuthContext';

const CACHE_KEY = 'profile:me';

interface ProfileState {
  profile: PlayerProfile | null;
  /** True while the first load (after an empty cache) is in flight. */
  loading: boolean;
  /** True when the user is authenticated but hasn't completed onboarding yet. */
  needsOnboarding: boolean;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileState | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const fetchFresh = useCallback(async () => {
    try {
      const fresh = await getMyProfile();
      setProfile(fresh);
      // A profile can exist mid-onboarding (step 1 creates it). Only treat the
      // user as done when onboarding is explicitly completed. Legacy profiles
      // without an onboarding record are treated as done (no forced re-onboard).
      setNeedsOnboarding(fresh.onboarding ? !fresh.onboarding.isCompleted : false);
      await writeCache(CACHE_KEY, fresh);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        // Authenticated but onboarding not finished — no profile yet.
        setProfile(null);
        setNeedsOnboarding(true);
        await clearCache(CACHE_KEY);
      }
      // Other errors (offline, etc.): keep whatever we already have.
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    await fetchFresh();
  }, [isAuthenticated, fetchFresh]);

  // Hydrate from cache immediately, then revalidate from the network.
  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setProfile(null);
      setNeedsOnboarding(false);
      return;
    }
    (async () => {
      setLoading(true);
      const cached = await readCache<PlayerProfile>(CACHE_KEY);
      if (active && cached) setProfile(cached);
      await fetchFresh();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, fetchFresh]);

  const value = useMemo<ProfileState>(
    () => ({ profile, loading, needsOnboarding, refresh }),
    [profile, loading, needsOnboarding, refresh],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileState {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
