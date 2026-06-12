import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors, fontSize } from '@/theme';
import type { IconName } from '@/types';

type Props = {
  icon: IconName;
  label: string;
  value: string;
  delta: string;
};

export function StatCard({ icon, label, value, delta }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Ionicons name={icon} size={16} color={colors.textFaint} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.delta}>{delta}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: 4 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: fontSize.xs, color: colors.textMuted },
  value: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  delta: { fontSize: fontSize.xs, color: colors.primary, fontWeight: '600' },
});
