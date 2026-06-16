import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, radius, spacing } from '@/theme';

const FAQS = [
  {
    q: 'How do I complete my profile?',
    a: 'Open the menu → “Edit profile & sports”. Your saved details are pre-filled, so you can update them anytime.',
  },
  {
    q: 'Who can see my profile?',
    a: 'Your profile is public by default so scouts and coaches can find you. Switch it to private from Edit Profile.',
  },
  {
    q: 'How are my stats calculated?',
    a: 'Stats are specific to each sport and update as you add matches and achievements to your profile.',
  },
  {
    q: 'Why does the app ask for camera or location?',
    a: 'Camera is used for photos and highlights; location helps surface nearby trials and academies. Manage both in Settings.',
  },
];

const CONTACTS: {
  icon: 'mail-outline' | 'logo-whatsapp' | 'globe-outline';
  label: string;
  value: string;
  url: string;
}[] = [
  { icon: 'mail-outline', label: 'Email us', value: 'support@openfield.in', url: 'mailto:support@openfield.in' },
  { icon: 'logo-whatsapp', label: 'WhatsApp', value: '+91 90000 00000', url: 'https://wa.me/919000000000' },
  { icon: 'globe-outline', label: 'Help Center', value: 'help.openfield.in', url: 'https://help.openfield.in' },
];

export default function HelpScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.groupTitle}>Get in touch</Text>
        <View style={styles.card}>
          {CONTACTS.map((c, i) => (
            <Pressable
              key={c.label}
              onPress={() => Linking.openURL(c.url).catch(() => undefined)}
              style={[styles.row, i < CONTACTS.length - 1 && styles.rowDivider]}
            >
              <View style={styles.rowIcon}>
                <Ionicons name={c.icon} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{c.label}</Text>
                <Text style={styles.rowDesc}>{c.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.groupTitle}>Frequently asked</Text>
        {FAQS.map((f) => (
          <View key={f.q} style={styles.faq}>
            <Text style={styles.faqQ}>{f.q}</Text>
            <Text style={styles.faqA}>{f.a}</Text>
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
  body: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  groupTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  rowDesc: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  faq: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  faqQ: { fontSize: fontSize.sm, fontWeight: '800', color: colors.text },
  faqA: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20 },
});
