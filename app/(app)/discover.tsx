import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { academies, recommendedPlayers } from '@/constants/mockData';
import { colors, fontSize, radius, spacing } from '@/theme';

const FILTERS = ['All', 'Players', 'Coaches', 'Academies', 'Events'];

export default function DiscoverScreen() {
  const [active, setActive] = useState('All');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.screenTitle}>Discover</Text>
        <View style={styles.topRight}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <Avatar name="Arjun Sharma" size={32} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.searchRow}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.textFaint} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search players, coaches..."
              placeholderTextColor={colors.textFaint}
            />
          </View>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.text} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map((f) => (
            <Chip key={f} label={f} active={active === f} onPress={() => setActive(f)} />
          ))}
        </ScrollView>

        <SectionHeader title="Recommended Players" actionLabel="View All" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {recommendedPlayers.map((p) => (
            <Card key={p.name} style={styles.playerCard}>
              <Avatar name={p.name} size={56} />
              <Text style={styles.playerName}>{p.name}</Text>
              <Text style={styles.playerMeta}>
                {p.role} · {p.age}
              </Text>
              <View style={styles.locRow}>
                <Ionicons name="location-outline" size={12} color={colors.textFaint} />
                <Text style={styles.playerLoc} numberOfLines={1}>
                  {p.location}
                </Text>
              </View>
              <PrimaryButton label="Connect" size="sm" variant="outline" style={styles.connect} />
            </Card>
          ))}
        </ScrollView>

        <SectionHeader title="Top Academies" actionLabel="View All" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {academies.map((a, i) => (
            <Card key={a.name} style={styles.academyCard} padded={false}>
              <ImageBackground
                source={{ uri: `https://picsum.photos/seed/acad${i}/400/220` }}
                style={styles.academyImg}
                imageStyle={styles.academyImgInner}
              />
              <View style={styles.academyBody}>
                <Text style={styles.academyName}>{a.name}</Text>
                <View style={styles.locRow}>
                  <Ionicons name="location-outline" size={12} color={colors.textFaint} />
                  <Text style={styles.playerLoc}>{a.location}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={colors.star} />
                  <Text style={styles.rating}>{a.rating}</Text>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>

        <SectionHeader title="Popular Communities" actionLabel="View All" />
        <View style={{ height: spacing.lg }} />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  screenTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  body: { paddingVertical: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  searchRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  search: {
    flex: 1,
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
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  hScroll: { gap: spacing.md, paddingHorizontal: spacing.lg },
  playerCard: { width: 150, alignItems: 'center', gap: 4 },
  playerName: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  playerMeta: { fontSize: fontSize.xs, color: colors.textMuted },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  playerLoc: { fontSize: 11, color: colors.textFaint, maxWidth: 120 },
  connect: { alignSelf: 'stretch', marginTop: spacing.xs },
  academyCard: { width: 220, overflow: 'hidden' },
  academyImg: { height: 96, backgroundColor: colors.surfaceAlt },
  academyImgInner: {},
  academyBody: { padding: spacing.md, gap: 4 },
  academyName: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
});
