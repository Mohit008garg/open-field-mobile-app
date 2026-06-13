import { useState } from 'react';
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
import { Card } from '@mohit008garg/open-field-common-components';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { events } from '@/constants/mockData';
import { colors, fontSize, radius, spacing } from '@/theme';

const TABS = ['Upcoming', 'My Events', 'Past Events'];

export default function EventsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('Upcoming');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.screenTitle}>Events</Text>
        </View>
        <Ionicons name="calendar-outline" size={22} color={colors.text} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor={colors.textFaint}
          />
        </View>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={styles.tab}>
              <Text style={[styles.tabLabel, tab === t && styles.tabActive]}>{t}</Text>
              {tab === t ? <View style={styles.tabUnderline} /> : null}
            </Pressable>
          ))}
        </View>

        <View style={styles.list}>
          {events.map((e) => (
            <Card key={e.title} style={styles.card}>
              <View style={styles.date}>
                <Text style={styles.month}>{e.month}</Text>
                <Text style={styles.day}>{e.day}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.title}>{e.title}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={13} color={colors.textFaint} />
                  <Text style={styles.meta}>{e.location}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={13} color={colors.textFaint} />
                  <Text style={styles.meta}>{e.dates}</Text>
                </View>
                <PrimaryButton label="Register" size="sm" style={styles.register} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 52,
    backgroundColor: colors.surface,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  screenTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  searchInput: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  tabs: { flexDirection: 'row', gap: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { paddingVertical: spacing.sm },
  tabLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textMuted },
  tabActive: { color: colors.primary },
  tabUnderline: { height: 2, backgroundColor: colors.primary, marginTop: spacing.sm, marginBottom: -1, borderRadius: 2 },
  list: { gap: spacing.md },
  card: { flexDirection: 'row', gap: spacing.md },
  date: {
    width: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  month: { fontSize: 11, fontWeight: '700', color: colors.primary },
  day: { fontSize: fontSize.lg, fontWeight: '800', color: colors.primaryDark },
  info: { flex: 1, gap: 4 },
  title: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: fontSize.xs, color: colors.textMuted },
  register: { marginTop: spacing.sm },
});
