import { useState } from 'react';
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
import { Avatar } from '@/components/ui/Avatar';
import { connections } from '@/constants/mockData';
import { colors, fontSize, radius, spacing } from '@/theme';

const TABS = ['Connections', 'Following', 'Followers', 'Requests'];

export default function NetworkScreen() {
  const [tab, setTab] = useState('Connections');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <View style={styles.titleRow}>
          <Avatar name="Arjun Sharma" size={32} />
          <Text style={styles.screenTitle}>My Network</Text>
        </View>
        <View style={styles.topRight}>
          <Ionicons name="person-add-outline" size={22} color={colors.text} />
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </View>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={styles.tab}>
            <Text style={[styles.tabLabel, tab === t && styles.tabActive]}>{t}</Text>
            {tab === t ? <View style={styles.tabUnderline} /> : null}
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search connections..."
            placeholderTextColor={colors.textFaint}
          />
          <Ionicons name="options-outline" size={18} color={colors.textFaint} />
        </View>

        {connections.map((c) => (
          <View key={c.name} style={styles.row}>
            <Avatar name={c.name} size={48} />
            <View style={styles.rowInfo}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.role}>{c.role}</Text>
            </View>
            <View style={styles.connected}>
              <Text style={styles.connectedText}>{c.status}</Text>
            </View>
          </View>
        ))}

        <View style={styles.promo}>
          <View style={styles.promoText}>
            <Text style={styles.promoTitle}>Grow Your Network</Text>
            <Text style={styles.promoSub}>
              Connecting with the right people opens doors to new opportunities and
              teams.
            </Text>
          </View>
          <View style={styles.promoIcon}>
            <Ionicons name="people" size={26} color={colors.primary} />
          </View>
        </View>
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
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  screenTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { paddingVertical: spacing.sm },
  tabLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textMuted },
  tabActive: { color: colors.primary },
  tabUnderline: {
    height: 2,
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
    marginBottom: -1,
    borderRadius: 2,
  },
  body: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
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
  rowInfo: { flex: 1 },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  role: { fontSize: fontSize.xs, color: colors.textMuted },
  connected: {
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectedText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  promoText: { flex: 1, gap: 2 },
  promoTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.primaryDark },
  promoSub: { fontSize: fontSize.xs, color: colors.textMuted, lineHeight: 18 },
  promoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
