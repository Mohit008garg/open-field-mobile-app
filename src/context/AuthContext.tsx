import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as authApi from '@/api/auth';
import { saveTokens } from '@/api/tokenStore';
import type { AuthUser } from '@/api/types';

interface AuthState {
  /** True until the persisted session has been loaded on cold start. */
  initializing: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  /** Exchange a Google ID token for an app session. Returns the user. */
  signInWithGoogle: (idToken: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore session on cold start: if we have stored tokens, treat the user as
  // signed in. (Profile is hydrated on the next sign-in or via API calls.)
  useEffect(() => {
    (async () => {
      const tokens = await authApi.getTokens();
      setIsAuthenticated(!!tokens);
      setInitializing(false);
    })();
  }, []);

  const signInWithGoogle = useCallback(async (idToken: string) => {
    const res = await authApi.signInWithGoogle(idToken);
    await saveTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    setUser(res.user);
    setIsAuthenticated(true);
    return res.user;
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    // Clear the Google session too, so the next sign-in prompts for an account
    // instead of silently reusing the last one.
    await GoogleSignin.signOut().catch(() => {});
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ initializing, isAuthenticated, user, signInWithGoogle, signOut }),
    [initializing, isAuthenticated, user, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
