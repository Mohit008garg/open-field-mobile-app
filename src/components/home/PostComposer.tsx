import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@mohit008garg/open-field-common-components';
import { Card } from '@mohit008garg/open-field-common-components';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { colors, fontSize, spacing } from '@/theme';
import type { IconName } from '@/types';

type Props = {
  authorName: string;
  onPost?: () => void;
};

export function PostComposer({ authorName, onPost }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <Avatar name={authorName} size={36} />
        <Text style={styles.hint}>What&apos;s happening in your sporting world?</Text>
      </View>
      <View style={styles.actions}>
        <Action icon="image-outline" label="Photo" />
        <Action icon="trophy-outline" label="Achievement" />
        <PrimaryButton label="Post" size="sm" style={styles.postBtn} onPress={onPost} />
      </View>
    </Card>
  );
}

function Action({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.action}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hint: { flex: 1, color: colors.textMuted, fontSize: fontSize.sm },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionLabel: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '600' },
  postBtn: { marginLeft: 'auto', paddingHorizontal: spacing.lg },
});
