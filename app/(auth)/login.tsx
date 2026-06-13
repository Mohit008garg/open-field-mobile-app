import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@mohit008garg/open-field-common-components';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { TextField } from '@mohit008garg/open-field-common-components';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();

  // No auth backend yet (OTP/login needs a third-party provider), so for now
  // every entry path drops you into the protected app.
  const enterApp = () => router.replace('/home');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Logo size={28} />
          <View style={styles.back} />
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your sports journey.
          </Text>

          <View style={styles.form}>
            <TextField
              label="Email Address"
              icon="mail-outline"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextField
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              password
            />
            <Pressable style={styles.forgot} hitSlop={8}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            <PrimaryButton label="Log In" onPress={enterApp} />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.or}>Or continue with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.social}>
            <SocialButton
              icon="logo-google"
              label="Google"
              iconColor="#EA4335"
              onPress={enterApp}
            />
            <SocialButton
              icon="logo-facebook"
              label="Facebook"
              filled={colors.facebook}
              onPress={enterApp}
            />
            <SocialButton
              icon="logo-apple"
              label="Apple"
              filled={colors.apple}
              onPress={enterApp}
            />
          </View>

          <Pressable onPress={enterApp} style={styles.skip} hitSlop={8}>
            <Text style={styles.skipText}>Skip &amp; explore the app →</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SocialButton({
  icon,
  label,
  iconColor,
  filled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  iconColor?: string;
  filled?: string;
  onPress?: () => void;
}) {
  const fg = filled ? colors.textInverse : colors.text;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.socialBtn,
        filled ? { backgroundColor: filled } : styles.socialOutline,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Ionicons name={icon} size={20} color={iconColor ?? fg} />
      <Text style={[styles.socialLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  form: { gap: spacing.md, marginTop: spacing.lg },
  forgot: { alignSelf: 'flex-end', marginTop: -spacing.xs },
  forgotText: { color: colors.primary, fontWeight: '700', fontSize: fontSize.sm },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.textMuted, fontSize: fontSize.sm },
  social: { gap: spacing.sm },
  socialBtn: {
    height: 50,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  socialOutline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  socialLabel: { fontSize: fontSize.md, fontWeight: '700' },
  skip: { alignSelf: 'center', marginTop: spacing.lg, padding: spacing.sm },
  skipText: { color: colors.primary, fontWeight: '700', fontSize: fontSize.md },
});
