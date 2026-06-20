import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@mohit008garg/open-field-common-components';
import { useGoogleAuth, type GoogleCredential } from '@/hooks/useGoogleAuth';
import { useAuth } from '@/context/AuthContext';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  // Exchange the Google ID token for an app session (JWT) before entering.
  const onSignedIn = async ({ idToken }: GoogleCredential) => {
    await signInWithGoogle(idToken);
    router.replace('/home');
  };

  const { signIn, loading, error, configured } = useGoogleAuth(onSignedIn);

  const handleGoogle = () => {
    if (!configured) {
      Alert.alert(
        'Google sign-in not configured',
        'Add your Google OAuth client IDs to EXPO_PUBLIC_GOOGLE_* in .env (see .env.example).',
      );
      return;
    }
    void signIn();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.back}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Logo size={28} />
        <View style={styles.back} />
      </View>

      <View style={styles.body}>
        <View style={styles.hero}>
          <Text style={styles.title}>Welcome to OpenField 👋</Text>
          <Text style={styles.subtitle}>
            Sign in with Google to start building your sports identity.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleGoogle}
            disabled={loading}
            style={({ pressed }) => [
              styles.googleBtn,
              pressed && !loading && styles.pressed,
              loading && styles.disabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text style={styles.googleLabel}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.note}>
            Phone (OTP) sign-in is coming soon — for now Google keeps your
            account secure with no password to remember.
          </Text>

          <Pressable onPress={() => router.replace('/home')} style={styles.skip} hitSlop={8}>
            <Text style={styles.skipText}>Skip &amp; explore the app (dev) →</Text>
          </Pressable>
        </View>

        <Text style={styles.terms}>
          By continuing you agree to our Terms &amp; Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  hero: { flex: 1, justifyContent: 'center', gap: spacing.sm },
  title: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    lineHeight: 22,
  },
  actions: { gap: spacing.md },
  googleBtn: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  googleLabel: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  error: { color: colors.danger, fontSize: fontSize.sm, textAlign: 'center' },
  note: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  skip: { alignSelf: 'center', padding: spacing.sm },
  skipText: { color: colors.primary, fontWeight: '700', fontSize: fontSize.sm },
  terms: {
    fontSize: fontSize.xs,
    color: colors.textFaint,
    textAlign: 'center',
  },
});
