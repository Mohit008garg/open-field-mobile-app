import { useEffect, useRef, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Completes the auth session if the app was opened via the OAuth redirect.
WebBrowser.maybeCompleteAuthSession();

export type GoogleUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

/**
 * Google sign-in via Expo AuthSession.
 * Requires Google OAuth client IDs in EXPO_PUBLIC_GOOGLE_* env vars
 * (see .env.example). `configured` is false until they're set.
 */
export function useGoogleAuth(onSignedIn: (user: GoogleUser) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSignedInRef = useRef(onSignedIn);
  onSignedInRef.current = onSignedIn;

  const configured = !!(WEB_CLIENT_ID || ANDROID_CLIENT_ID || IOS_CLIENT_ID);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const token = response.authentication?.accessToken;
      if (!token) {
        setLoading(false);
        setError('Google did not return an access token.');
        return;
      }
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((u) => {
          setLoading(false);
          onSignedInRef.current({
            id: u.id,
            email: u.email,
            name: u.name,
            picture: u.picture,
          });
        })
        .catch(() => {
          setLoading(false);
          setError('Could not load your Google profile.');
        });
    } else if (response.type === 'error') {
      setLoading(false);
      setError(response.error?.message ?? 'Google sign-in failed.');
    } else {
      // dismiss / cancel
      setLoading(false);
    }
  }, [response]);

  const signIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await promptAsync();
      if (result.type !== 'success') setLoading(false);
    } catch {
      setLoading(false);
      setError('Could not start Google sign-in.');
    }
  };

  return { signIn, loading, error, configured, ready: !!request };
}
