import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, type IconName } from '@mohit008garg/open-field-common-components';
import { useAuth } from '@/context/AuthContext';
import { colors, fontSize, radius, spacing } from '@/theme';

type Item = { icon: IconName; label: string; tint: string; color: string; onPress: () => void };

export default function MenuScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const groups: { title: string; items: Item[] }[] = [
    {
      title: 'Profile',
      items: [
        { icon: 'person-outline', label: 'My Profile', tint: '#DCFCE7', color: '#16A34A', onPress: () => router.push('/profile') },
        { icon: 'create-outline', label: 'Edit profile & sports', tint: '#DBEAFE', color: '#2563EB', onPress: () => router.push('/onboarding') },
        { icon: 'medal-outline', label: 'Achievements', tint: '#FFEDD5', color: '#EA580C', onPress: () => router.push('/profile') },
      ],
    },
    {
      title: 'Network',
      items: [
        { icon: 'people-outline', label: 'Connections', tint: '#F3E8FF', color: '#9333EA', onPress: () => router.push('/network') },
        { icon: 'business-outline', label: 'Academies', tint: '#E0F2FE', color: '#0284C7', onPress: () => router.push('/discover') },
        { icon: 'briefcase-outline', label: 'Opportunities', tint: '#FEF9C3', color: '#CA8A04', onPress: () => router.push('/jobs') },
      ],
    },
    {
      title: 'Settings',
      items: [
        { icon: 'settings-outline', label: 'Settings', tint: '#F1F5F9', color: '#475569', onPress: () => undefined },
        { icon: 'shield-checkmark-outline', label: 'Privacy', tint: '#F1F5F9', color: '#475569', onPress: () => undefined },
        { icon: 'help-circle-outline', label: 'Help & support', tint: '#F1F5F9', color: '#475569', onPress: () => undefined },
      ],
    },
  ];

  const onLogout = async () => {
    await signOut();
    router.replace('/start');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.close}>
          <Icon name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Avatar name={user?.name ?? user?.email ?? 'OpenField'} size={52} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name ?? 'Your profile'}</Text>
            <Text style={styles.sub} numberOfLines={1}>
              {user?.email ?? user?.phone ?? 'Tap to complete your profile'}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/profile')} hitSlop={8}>
            <Icon name="chevron-forward" size={20} color={colors.textFaint} />
          </Pressable>
        </View>

        {groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  style={[styles.row, i < group.items.length - 1 && styles.rowDivider]}
                >
                  <View style={[styles.rowIcon, { backgroundColor: item.tint }]}>
                    <Icon name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Icon name="chevron-forward" size={18} color={colors.textFaint} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Pressable onPress={onLogout} style={styles.logout}>
          <Icon name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
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
  headerTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  close: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  body: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  name: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  sub: { fontSize: fontSize.sm, color: colors.textMuted },
  group: { gap: spacing.sm },
  groupTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  logoutText: { fontSize: fontSize.md, fontWeight: '700', color: colors.danger },
});
