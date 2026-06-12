import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

export function GrowNetworkCard() {
  return (
    <View style={styles.card}>
      <View style={styles.text}>
        <Text style={styles.title}>Grow Your Network</Text>
        <Text style={styles.sub}>
          Connecting with the right people opens doors to new opportunities and
          teams.
        </Text>
      </View>
      <View style={styles.icon}>
        <Ionicons name="people" size={26} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  text: { flex: 1, gap: 2 },
  title: { fontSize: fontSize.md, fontWeight: '800', color: colors.primaryDark },
  sub: { fontSize: fontSize.xs, color: colors.textMuted, lineHeight: 18 },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
