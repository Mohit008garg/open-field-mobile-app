import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  PrimaryButton,
  SegmentedTabs,
} from '@mohit008garg/open-field-common-components';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import type { PlayerProfile, PlayerSport, ResolvedAttribute } from '@/api';
import { colors, fontSize, radius, spacing } from '@/theme';

const TABS = ['About', 'Highlights', 'Stats', 'Achievements'] as const;
type Tab = (typeof TABS)[number];

const LEVEL_LABEL: Record<string, string> = {
  DISTRICT: 'District',
  STATE: 'State',
  NATIONAL: 'National',
  INTERNATIONAL: 'International',
};
const POSITION_LABEL: Record<string, string> = {
  GOLD: 'Gold',
  SILVER: 'Silver',
  BRONZE: 'Bronze',
  FOURTH: '4th place',
  PARTICIPATION: 'Participation',
};

function titleCase(value?: string | null): string {
  if (!value) return '—';
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function ageFrom(dob?: string): string {
  if (!dob) return '—';
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return '—';
  const diff = Date.now() - d.getTime();
  return `${Math.floor(diff / (365.25 * 24 * 3600 * 1000))} yrs`;
}

function formatAttr(a: ResolvedAttribute): string {
  if (a.value === null || a.value === undefined || a.value === '') return '—';
  if (a.dataType === 'BOOLEAN') return a.value ? 'Yes' : 'No';
  const base = String(a.value);
  return a.unit ? `${base} ${a.unit}` : base;
}

function primarySport(profile: PlayerProfile | null): PlayerSport | null {
  if (!profile?.playerSports?.length) return null;
  return profile.playerSports.find((s) => s.isPrimary) ?? profile.playerSports[0];
}

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { user } = useAuth();
  const { profile, loading, needsOnboarding, refresh } = useProfile();
  const [tab, setTab] = useState<Tab>('About');

  // Open the tab requested via navigation params (e.g. menu → Achievements).
  useEffect(() => {
    const requested = TABS.find((t) => t.toLowerCase() === String(params.tab).toLowerCase());
    if (requested) setTab(requested);
  }, [params.tab]);

  // Re-fetch when the screen regains focus (e.g. returning from edit).
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  if (loading && !profile) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['top']}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (needsOnboarding && !profile) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['top']}>
        <View style={styles.emptyWrap}>
          <Ionicons name="person-circle-outline" size={64} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>Build your profile</Text>
          <Text style={styles.emptyText}>
            Complete a quick setup to create your sports identity.
          </Text>
          <PrimaryButton label="Get started" onPress={() => router.push('/onboarding')} />
        </View>
      </SafeAreaView>
    );
  }

  const name = profile?.fullName ?? user?.name ?? 'Your profile';
  const sport = primarySport(profile);
  const location =
    [profile?.location?.city?.name, profile?.location?.state?.name].filter(Boolean).join(', ') ||
    '—';

  // Stat cells: a few key sport attributes + physical stats.
  const sportAttrs = (sport?.attributes ?? []).slice(0, 3);
  const statCells: { label: string; value: string }[] = [
    ...sportAttrs.map((a) => ({ label: a.label, value: formatAttr(a) })),
    { label: 'Height', value: profile?.heightCm ? `${profile.heightCm} cm` : '—' },
    { label: 'Weight', value: profile?.weightKg ? `${profile.weightKg} kg` : '—' },
  ].slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.screenTitle}>Profile</Text>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <ImageBackground
          source={{ uri: profile?.coverUrl || 'https://picsum.photos/seed/cover/800/300' }}
          style={styles.cover}
        >
          <Pressable style={styles.editCover} onPress={() => router.push('/onboarding')}>
            <Ionicons name="pencil" size={16} color={colors.text} />
          </Pressable>
        </ImageBackground>

        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Avatar name={name} size={88} style={styles.avatar} />
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {profile?.isPublic ? (
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            ) : null}
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="football-outline" size={14} color={colors.textMuted} />
            <Text style={styles.role}>{sport?.sport.name ?? 'Add a sport'}</Text>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} style={{ marginLeft: spacing.sm }} />
            <Text style={styles.role}>{location}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {statCells.map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Text style={styles.statValue} numberOfLines={1}>{s.value}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Edit Profile" style={styles.flex} onPress={() => router.push('/onboarding')} />
          <PrimaryButton label="Share Profile" variant="outline" icon="share-social-outline" style={styles.flex} />
        </View>

        <View style={styles.tabsWrap}>
          <SegmentedTabs tabs={TABS} value={tab} onChange={(t) => setTab(t as Tab)} bordered />
        </View>

        {tab === 'About' && <AboutTab profile={profile} />}
        {tab === 'Highlights' && <HighlightsTab profile={profile} />}
        {tab === 'Stats' && <StatsTab profile={profile} />}
        {tab === 'Achievements' && <AchievementsTab profile={profile} />}
      </ScrollView>
    </SafeAreaView>
  );
}

function AboutTab({ profile }: { profile: PlayerProfile | null }) {
  const dob = profile?.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';
  const details: { key: string; value: string }[] = [
    { key: 'Date of Birth', value: dob },
    { key: 'Age', value: ageFrom(profile?.dateOfBirth) },
    { key: 'Gender', value: titleCase(profile?.gender) },
    { key: 'Playing Level', value: profile?.playingLevel ?? '—' },
    { key: 'Preferred Foot', value: profile?.preferredFoot ?? '—' },
    { key: 'Jersey Number', value: profile?.jerseyNumber != null ? String(profile.jerseyNumber) : '—' },
    { key: 'Current Team', value: profile?.currentTeam ?? '—' },
    { key: 'School / College', value: profile?.school ?? '—' },
    { key: 'City', value: profile?.location?.city?.name ?? '—' },
    { key: 'State', value: profile?.location?.state?.name ?? '—' },
    { key: 'Height', value: profile?.heightCm ? `${profile.heightCm} cm` : '—' },
    { key: 'Weight', value: profile?.weightKg ? `${profile.weightKg} kg` : '—' },
    { key: 'Years of training', value: profile?.yearsOfTraining != null ? String(profile.yearsOfTraining) : '—' },
    { key: 'Coach', value: profile?.currentCoach ?? '—' },
  ];
  const skills = profile?.skills ?? [];
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.about}>
          {profile?.bio?.trim() || 'No bio yet. Tap “Edit Profile” to add one.'}
        </Text>
      </View>

      {skills.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {skills.map((s) => (
            <View key={s.id} style={styles.skillRow}>
              <View style={styles.skillHead}>
                <Text style={styles.skillLabel}>{s.label}</Text>
                <Text style={styles.skillPct}>{s.rating}%</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: `${Math.max(0, Math.min(100, s.rating))}%` }]} />
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        {details.map((d) => (
          <View key={d.key} style={styles.detailRow}>
            <Text style={styles.detailKey}>{d.key}</Text>
            <Text style={styles.detailVal}>{d.value}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function HighlightsTab({ profile }: { profile: PlayerProfile | null }) {
  const videos = profile?.videos ?? [];
  if (!videos.length) {
    return <EmptyState icon="videocam-outline" text="No highlights uploaded yet." />;
  }
  return (
    <View style={styles.section}>
      {videos.map((v) => (
        <View key={v.id} style={styles.listCard}>
          <View style={styles.listIcon}>
            <Ionicons name="play-circle" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{v.title}</Text>
            {v.description ? <Text style={styles.listSub} numberOfLines={2}>{v.description}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

function StatsTab({ profile }: { profile: PlayerProfile | null }) {
  const sports = profile?.playerSports ?? [];
  if (!sports.length) {
    return <EmptyState icon="stats-chart-outline" text="Add a sport to track your stats." />;
  }
  return (
    <View style={styles.section}>
      {sports.map((ps) => (
        <View key={ps.id} style={{ gap: spacing.sm }}>
          <Text style={styles.sectionTitle}>
            {ps.sport.name}
            {ps.isPrimary ? '  ·  Primary' : ''}
          </Text>
          {ps.academyName ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Academy</Text>
              <Text style={styles.detailVal}>{ps.academyName}</Text>
            </View>
          ) : null}
          {ps.attributes.length ? (
            ps.attributes.map((a) => (
              <View key={a.key} style={styles.detailRow}>
                <Text style={styles.detailKey}>{a.label}</Text>
                <Text style={styles.detailVal}>{formatAttr(a)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.about}>No stats recorded for this sport.</Text>
          )}
        </View>
      ))}
    </View>
  );
}

function AchievementsTab({ profile }: { profile: PlayerProfile | null }) {
  const achievements = profile?.achievements ?? [];
  if (!achievements.length) {
    return <EmptyState icon="trophy-outline" text="No achievements added yet." />;
  }
  return (
    <View style={styles.section}>
      {achievements.map((a) => (
        <View key={a.id} style={styles.listCard}>
          <View style={styles.listIcon}>
            <Ionicons name="medal" size={22} color={colors.star} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{a.competitionName}</Text>
            <Text style={styles.listSub}>
              {POSITION_LABEL[a.position] ?? a.position} · {LEVEL_LABEL[a.level] ?? a.level} · {a.year}
            </Text>
          </View>
          {a.isVerified ? (
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

function EmptyState({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.emptyTab}>
      <Ionicons name={icon} size={40} color={colors.textFaint} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  center: { alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { alignItems: 'center', gap: spacing.md, padding: spacing.xl },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center' },
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
  statCell: { flex: 1, alignItems: 'center', gap: 2, paddingHorizontal: 2 },
  statValue: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted },
  actions: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  flex: { flex: 1 },
  tabsWrap: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  about: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 22 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  detailKey: { fontSize: fontSize.sm, color: colors.textMuted },
  detailVal: { fontSize: fontSize.sm, color: colors.text, fontWeight: '700' },
  skillRow: { gap: 6, paddingVertical: spacing.xs },
  skillHead: { flexDirection: 'row', justifyContent: 'space-between' },
  skillLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: '600' },
  skillPct: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '700' },
  skillTrack: { height: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  skillFill: { height: 8, borderRadius: radius.pill, backgroundColor: colors.primary },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
  listSub: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  emptyTab: { alignItems: 'center', gap: spacing.sm, padding: spacing.xl, marginTop: spacing.md },
});
