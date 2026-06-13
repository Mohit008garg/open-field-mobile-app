import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  onCreate?: () => void;
  onExplore?: () => void;
};

export function HeroBanner({ onCreate, onExplore }: Props) {
  return (
    <ImageBackground
      source={{ uri: 'https://picsum.photos/seed/openfield-hero/700/400' }}
      style={styles.hero}
      imageStyle={styles.heroImg}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>
          Connect. Discover.{'\n'}
          <Text style={{ color: colors.primaryTint }}>Grow in Sports.</Text>
        </Text>
        <Text style={styles.sub}>
          OpenField is your platform to build your identity.
        </Text>
        <View style={styles.btns}>
          <PrimaryButton label="Create Profile" size="sm" onPress={onCreate} />
          <PrimaryButton label="Explore" size="sm" variant="outline" onPress={onExplore} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: { height: 180, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.text },
  heroImg: { borderRadius: radius.lg },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textInverse, lineHeight: 30 },
  sub: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.85)' },
  btns: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
});
