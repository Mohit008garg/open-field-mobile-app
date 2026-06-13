import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@mohit008garg/open-field-common-components';
import { Card } from '@mohit008garg/open-field-common-components';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { colors, fontSize, spacing } from '@/theme';
import type { Player } from '@/types';

type Props = {
  player: Player;
  onConnect?: () => void;
};

export function PlayerCard({ player, onConnect }: Props) {
  return (
    <Card style={styles.card}>
      <Avatar name={player.name} size={56} />
      <Text style={styles.name}>{player.name}</Text>
      <Text style={styles.meta}>
        {player.role} · {player.age}
      </Text>
      <View style={styles.locRow}>
        <Ionicons name="location-outline" size={12} color={colors.textFaint} />
        <Text style={styles.loc} numberOfLines={1}>
          {player.location}
        </Text>
      </View>
      <PrimaryButton label="Connect" size="sm" variant="outline" style={styles.connect} onPress={onConnect} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: 150, alignItems: 'center', gap: 4 },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  meta: { fontSize: fontSize.xs, color: colors.textMuted },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  loc: { fontSize: 11, color: colors.textFaint, maxWidth: 120 },
  connect: { alignSelf: 'stretch', marginTop: spacing.xs },
});
