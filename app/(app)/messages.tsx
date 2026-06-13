import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@mohit008garg/open-field-common-components';
import { messages } from '@/constants/mockData';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.screenTitle}>Messages</Text>
        </View>
        <Ionicons name="create-outline" size={22} color={colors.text} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor={colors.textFaint}
          />
        </View>

        {messages.map((m, i) => (
          <Pressable key={m.name} style={styles.row}>
            <Avatar name={m.name} size={50} online={i === 0} />
            <View style={styles.info}>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={[styles.preview, m.unread && styles.unreadPreview]} numberOfLines={1}>
                {m.text}
              </Text>
            </View>
            <View style={styles.meta}>
              <Text style={[styles.time, m.unread && styles.unreadTime]}>{m.time}</Text>
              {m.unread ? <View style={styles.dot} /> : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  screenTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
  },
  searchInput: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, gap: 2 },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  preview: { fontSize: fontSize.sm, color: colors.textMuted },
  unreadPreview: { color: colors.text, fontWeight: '600' },
  meta: { alignItems: 'flex-end', gap: 4 },
  time: { fontSize: 11, color: colors.textFaint },
  unreadTime: { color: colors.primary, fontWeight: '700' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
