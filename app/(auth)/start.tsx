import { useRouter } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@mohit008garg/open-field-common-components';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function StartScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <ImageBackground
        source={{ uri: 'https://picsum.photos/seed/openfield-sport/800/1000' }}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <Logo size={34} light />
        </SafeAreaView>
      </ImageBackground>

      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.grab} />
        <Text style={styles.headline}>
          Connect. Discover.{'\n'}
          <Text style={styles.headlineAccent}>Grow in Sports.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Your platform to build your identity, connect with the right people and
          discover opportunities.
        </Text>

        <View style={styles.actions}>
          <PrimaryButton
            label="Get Started"
            iconRight="arrow-forward"
            onPress={() => router.push('/login')}
          />
          <PrimaryButton
            label="Log In"
            variant="outline"
            onPress={() => router.push('/login')}
          />
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  hero: {
    flex: 1,
    backgroundColor: colors.text,
  },
  heroSafe: {
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    marginTop: -28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  grab: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 38,
  },
  headlineAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  terms: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
});
