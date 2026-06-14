import { useState } from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export type GoogleUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

// webClientId is required so Google returns an ID token we can hand to the
// backend. The native Android sign-in is authorised via the app's package name
// + signing SHA-1 registered on the Android OAuth client (same Google project).
GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });

/**
 * Native Google sign-in via @react-native-google-signin/google-signin.
 * Uses the OS account picker — no browser/redirect URI. Requires a dev or
 * standalone build (not Expo Go).
 */
export function useGoogleAuth(onSignedIn: (user: GoogleUser) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = !!WEB_CLIENT_ID;

  const signIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();

      // v13 returns { type, data: { user } }; older returns { user } directly.
      const anyResult = result as unknown as {
        data?: { user?: GoogleUser & { photo?: string } };
        user?: GoogleUser & { photo?: string };
      };
      const u = anyResult.data?.user ?? anyResult.user;
      if (!u) {
        setError('Google did not return a profile.');
        return;
      }
      onSignedIn({
        id: u.id,
        email: u.email,
        name: u.name,
        picture: (u as { photo?: string }).photo ?? u.picture,
      });
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (
        err.code === statusCodes.SIGN_IN_CANCELLED ||
        err.code === statusCodes.IN_PROGRESS
      ) {
        // user cancelled / already running — no error to show
      } else {
        setError(err.message ?? 'Google sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error, configured, ready: true };
}
