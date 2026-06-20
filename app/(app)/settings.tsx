import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PERMISSION_META,
  getAllPermissions,
  requestPermission,
  type PermissionKey,
  type PermissionState,
} from '@/permissions/permissions';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const [perms, setPerms] = useState<Record<PermissionKey, PermissionState> | null>(null);

  const load = useCallback(() => {
    getAllPermissions().then(setPerms).catch(() => undefined);
  }, []);

  // Refresh whenever the screen is focused (e.g. returning from OS settings).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onToggle = async (key: PermissionKey, current: PermissionState) => {
    if (current === 'granted') {
      // Can't revoke programmatically — send the user to the OS settings.
      Alert.alert(
        'Manage permission',
        'To turn this off, open OpenField in your device Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const next = await requestPermission(key);
    if (next === 'denied') {
      Alert.alert(
        'Permission needed',
        'Enable this permission for OpenField in your device Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
    load();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.groupTitle}>App Permissions</Text>
        <Text style={styles.groupHint}>
          OpenField asks for these once on first launch. You can change them here anytime.
        </Text>

        <View style={styles.card}>
          {PERMISSION_META.map((meta, i) => {
            const state = perms?.[meta.key] ?? 'undetermined';
            return (
              <View
                key={meta.key}
                style={[styles.row, i < PERMISSION_META.length - 1 && styles.rowDivider]}
              >
                <View style={styles.rowIcon}>
                  <Ionicons name={meta.icon} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{meta.label}</Text>
                  <Text style={styles.rowDesc}>{meta.description}</Text>
                  <Text style={[styles.status, state === 'granted' && styles.statusOn]}>
                    {state === 'granted' ? 'Allowed' : state === 'denied' ? 'Blocked' : 'Not set'}
                  </Text>
                </View>
                <Switch
                  value={state === 'granted'}
                  onValueChange={() => onToggle(meta.key, state)}
                  trackColor={{ true: colors.primary, false: colors.border }}
                  thumbColor={colors.surface}
                />
              </View>
            );
          })}
        </View>

        <Pressable style={styles.linkRow} onPress={() => Linking.openSettings()}>
          <Ionicons name="open-outline" size={18} color={colors.textMuted} />
          <Text style={styles.linkText}>Open device settings</Text>
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
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  groupTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  groupHint: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.sm },
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
  status: { fontSize: fontSize.xs, color: colors.textFaint, fontWeight: '700', marginTop: 4 },
  statusOn: { color: colors.primary },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  linkText: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '600' },
});
