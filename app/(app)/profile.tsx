import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@mohit008garg/open-field-common-components';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { me } from '@/constants/mockData';
import { colors, fontSize, radius, spacing } from '@/theme';

const TABS = ['About', 'Highlights', 'Stats', 'Achievements'];

const STATS = [
  { label: 'Matches', value: me.stats.matches },
  { label: 'Goals', value: me.stats.goals },
  { label: 'Assists', value: me.stats.assists },
  { label: 'Height', value: me.stats.height },
  { label: 'Position', value: me.stats.position },
];

export default function ProfileScreen() {
  const [tab, setTab] = useState('About');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.screenTitle}>Profile</Text>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <ImageBackground
          source={{ uri: 'https://picsum.photos/seed/cover/800/300' }}
          style={styles.cover}
        >
          <Pressable style={styles.editCover}>
            <Ionicons name="pencil" size={16} color={colors.text} />
          </Pressable>
        </ImageBackground>

        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Avatar name={me.name} size={88} style={styles.avatar} />
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{me.name}</Text>
            {me.verified ? (
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            ) : null}
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="football-outline" size={14} color={colors.textMuted} />
            <Text style={styles.role}>{me.role}</Text>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} style={{ marginLeft: spacing.sm }} />
            <Text style={styles.role}>{me.location}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Edit Profile" style={styles.flex} />
          <PrimaryButton label="Share Profile" variant="outline" icon="share-social-outline" style={styles.flex} />
        </View>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={styles.tab}>
              <Text style={[styles.tabLabel, tab === t && styles.tabActive]}>{t}</Text>
              {tab === t ? <View style={styles.tabUnderline} /> : null}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.about}>{me.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          {Object.entries(me.details).map(([k, v]) => (
            <View key={k} style={styles.detailRow}>
              <Text style={styles.detailKey}>{k}</Text>
              <Text style={styles.detailVal}>{v}</Text>
            </View>
          ))}
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
  screenTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  cover: { height: 120, backgroundColor: colors.surfaceAlt },
  editCover: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { paddingHorizontal: spacing.lg },
  avatarWrap: { marginTop: -44 },
  avatar: { borderWidth: 4, borderColor: colors.surface, borderRadius: 48 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  name: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  role: { fontSize: fontSize.sm, color: colors.textMuted },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted },
  actions: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  flex: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    marginTop: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { paddingVertical: spacing.sm },
  tabLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textMuted },
  tabActive: { color: colors.primary },
  tabUnderline: { height: 2, backgroundColor: colors.primary, marginTop: spacing.sm, marginBottom: -1, borderRadius: 2 },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  about: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 22 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  detailKey: { fontSize: fontSize.sm, color: colors.textMuted },
  detailVal: { fontSize: fontSize.sm, color: colors.text, fontWeight: '700' },
});
