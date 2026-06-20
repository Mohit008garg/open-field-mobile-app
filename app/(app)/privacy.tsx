import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, spacing } from '@/theme';

const SECTIONS = [
  {
    title: 'Information we collect',
    body: 'We collect the profile details you provide — your name, sport, district, physical stats, achievements and any media you upload — to build your sports identity.',
  },
  {
    title: 'How we use it',
    body: 'Your information powers your public profile, helps coaches and scouts discover you, and surfaces relevant academies, trials and opportunities near you.',
  },
  {
    title: 'What you control',
    body: 'You can make your profile public or private, edit or remove your details at any time, and manage device permissions (camera, location, notifications) from Settings.',
  },
  {
    title: 'Data sharing',
    body: 'We never sell your personal data. Public profile information is visible to other OpenField users in line with your privacy setting.',
  },
  {
    title: 'Contact',
    body: 'Questions about your data? Reach us at privacy@openfield.in and we will respond within 7 days.',
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: June 2026 · Sample policy</Text>
        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.text}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  updated: { fontSize: fontSize.xs, color: colors.textFaint },
  section: { gap: spacing.xs },
  title: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  text: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 22 },
});
