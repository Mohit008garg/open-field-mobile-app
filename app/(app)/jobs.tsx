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
import { Avatar } from '@mohit008garg/open-field-common-components';
import { Card } from '@mohit008garg/open-field-common-components';
import { Chip } from '@mohit008garg/open-field-common-components';
import { PrimaryButton } from '@mohit008garg/open-field-common-components';
import { opportunities } from '@/constants/mockData';
import { colors, fontSize, radius, spacing } from '@/theme';

const FILTERS = ['All', 'Trials', 'Scholarships', 'Jobs', 'Camps'];

export default function JobsScreen() {
  const [active, setActive] = useState('All');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <View style={styles.titleRow}>
          <Avatar name="Arjun Sharma" size={32} />
          <Text style={styles.screenTitle}>Opportunities</Text>
        </View>
        <View style={styles.topRight}>
          <Ionicons name="bookmark-outline" size={22} color={colors.text} />
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.searchRow}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.textFaint} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search trials, scholarships..."
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

        <View style={styles.list}>
          {opportunities.map((o, i) => (
            <Card key={o.title} padded={false} style={styles.card}>
              {i === 1 ? (
                <ImageBackground
                  source={{ uri: 'https://picsum.photos/seed/jobimg/600/280' }}
                  style={styles.banner}
                  imageStyle={styles.bannerImg}
                >
                  <View style={styles.bannerTag}>
                    <Text style={styles.tagText}>{o.tag}</Text>
                  </View>
                </ImageBackground>
              ) : null}
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  {i !== 1 ? (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{o.tag}</Text>
                    </View>
                  ) : (
                    <View />
                  )}
                  <Ionicons name="bookmark-outline" size={18} color={colors.textFaint} />
                </View>
                <Text style={styles.title}>{o.title}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="business-outline" size={14} color={colors.primary} />
                  <Text style={styles.org}>{o.org}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textFaint} />
                  <Text style={styles.meta}>{o.location}</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={colors.textFaint}
                    style={{ marginLeft: spacing.md }}
                  />
                  <Text style={styles.meta}>{o.date}</Text>
                </View>
                <PrimaryButton label="Apply Now" style={styles.apply} />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: { overflow: 'hidden' },
  banner: { height: 120, backgroundColor: colors.surfaceAlt, justifyContent: 'flex-start' },
  bannerImg: {},
  bannerTag: {
    alignSelf: 'flex-end',
    margin: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  cardBody: { padding: spacing.md, gap: 6 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tag: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  tagText: { fontSize: 11, fontWeight: '700', color: colors.primaryDark },
  title: { fontSize: fontSize.md, fontWeight: '800', color: colors.primaryDark },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  org: { fontSize: fontSize.sm, color: colors.text, fontWeight: '600' },
  meta: { fontSize: fontSize.xs, color: colors.textMuted },
  apply: { marginTop: spacing.sm },
});
