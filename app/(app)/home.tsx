import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@mohit008garg/open-field-common-components';
import { Avatar } from '@mohit008garg/open-field-common-components';
import { Card } from '@mohit008garg/open-field-common-components';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { SectionHeader } from '@mohit008garg/open-field-common-components';
import { me } from '@/constants/mockData';
import { colors, fontSize, radius, spacing } from '@/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

const QUICK = [
  { icon: 'person-add' as IoniconName, label: 'Find Players', tint: '#DCFCE7', color: '#16A34A' },
  { icon: 'school' as IoniconName, label: 'Find Coaches', tint: '#DBEAFE', color: '#2563EB' },
  { icon: 'business' as IoniconName, label: 'Academies', tint: '#F3E8FF', color: '#9333EA' },
  { icon: 'trophy' as IoniconName, label: 'Tournaments', tint: '#FFEDD5', color: '#EA580C' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Pressable onPress={() => router.push('/menu')} hitSlop={8}>
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Logo size={26} />
        <View style={styles.topRight}>
          <Pressable onPress={() => router.push('/messages')} hitSlop={8}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.text} />
          </Pressable>
          <View>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.bellDot} />
          </View>
          <Avatar name={me.name} size={32} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players, coaches, events..."
            placeholderTextColor={colors.textFaint}
          />
        </View>

        {/* Hero */}
        <ImageBackground
          source={{ uri: 'https://picsum.photos/seed/openfield-hero/700/400' }}
          style={styles.hero}
          imageStyle={styles.heroImg}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              Connect. Discover.{'\n'}
              <Text style={{ color: colors.primaryTint }}>Grow in Sports.</Text>
            </Text>
            <Text style={styles.heroSub}>
              OpenField is your platform to build your identity.
            </Text>
            <View style={styles.heroBtns}>
              <PrimaryButton
                label="Create Profile"
                size="sm"
                onPress={() => router.push('/profile')}
              />
              <PrimaryButton
                label="Explore"
                size="sm"
                variant="outline"
                onPress={() => router.push('/discover')}
              />
            </View>
          </View>
        </ImageBackground>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="stats-chart" label="Profile Views" value="1,248" delta="+24% this week" />
          <StatCard icon="people" label="My Connections" value="312" delta="+18 this week" />
        </View>

        {/* Quick access */}
        <SectionHeader title="Quick Access" actionLabel="View All" />
        <View style={styles.quickRow}>
          {QUICK.map((q) => (
            <Pressable
              key={q.label}
              style={styles.quick}
              onPress={() => router.push(q.label === 'Tournaments' ? '/events' : '/discover')}
            >
              <View style={[styles.quickIcon, { backgroundColor: q.tint }]}>
                <Ionicons name={q.icon} size={22} color={q.color} />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Composer */}
        <Card style={styles.composer}>
          <View style={styles.composerTop}>
            <Avatar name={me.name} size={36} />
            <Text style={styles.composerHint}>
              What&apos;s happening in your sporting world?
            </Text>
          </View>
          <View style={styles.composerActions}>
            <ComposerAction icon="image-outline" label="Photo" />
            <ComposerAction icon="trophy-outline" label="Achievement" />
            <PrimaryButton label="Post" size="sm" style={styles.postBtn} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  delta,
}: {
  icon: IoniconName;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <Card style={styles.stat}>
      <View style={styles.statHead}>
        <Text style={styles.statLabel}>{label}</Text>
        <Ionicons name={icon} size={16} color={colors.textFaint} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statDelta}>{delta}</Text>
    </Card>
  );
}

function ComposerAction({ icon, label }: { icon: IoniconName; label: string }) {
  return (
    <View style={styles.composerAction}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.composerActionLabel}>{label}</Text>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bellDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  body: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  searchInput: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  hero: { height: 180, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.text },
  heroImg: { borderRadius: radius.lg },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  heroTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textInverse, lineHeight: 30 },
  heroSub: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.85)' },
  heroBtns: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, gap: 4 },
  statHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted },
  statValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  statDelta: { fontSize: fontSize.xs, color: colors.primary, fontWeight: '600' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quick: { alignItems: 'center', gap: spacing.xs, width: '23%' },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600', textAlign: 'center' },
  composer: { gap: spacing.md },
  composerTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  composerHint: { flex: 1, color: colors.textMuted, fontSize: fontSize.sm },
  composerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  composerAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  composerActionLabel: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '600' },
  postBtn: { marginLeft: 'auto', paddingHorizontal: spacing.lg },
});
