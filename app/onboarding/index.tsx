import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DateField,
  Icon,
  PrimaryButton,
  Select,
  SportIcon,
  TextField,
} from '@mohit008garg/open-field-common-components';
import {
  completeOnboarding,
  getDistricts,
  getSportAttributes,
  getSports,
  saveOnboardingStep,
  type DistrictRef,
  type Sport,
  type SportAttributeDefinition,
} from '@/api';
import { colors, fontSize, radius, spacing } from '@/theme';

const TOTAL = 3;
const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];
const currentYear = new Date().getFullYear();

type AttrValues = Record<string, Record<string, unknown>>; // sportId -> key -> value

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reference data
  const [sports, setSports] = useState<Sport[]>([]);
  const [districts, setDistricts] = useState<DistrictRef[]>([]);
  const [attrDefs, setAttrDefs] = useState<Record<string, SportAttributeDefinition[]>>({});

  // Step 1
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [district, setDistrict] = useState('');

  // Step 2
  const [selected, setSelected] = useState<string[]>([]);
  const [attrValues, setAttrValues] = useState<AttrValues>({});

  // Step 3
  const [yearsOfTraining, setYearsOfTraining] = useState('');
  const [currentAcademy, setCurrentAcademy] = useState('');
  const [currentCoach, setCurrentCoach] = useState('');

  useEffect(() => {
    getSports().then(setSports).catch(() => undefined);
    getDistricts().then(setDistricts).catch(() => undefined);
  }, []);

  const toggleSport = async (sportId: string) => {
    setError(null);
    if (selected.includes(sportId)) {
      setSelected((s) => s.filter((id) => id !== sportId));
      return;
    }
    setSelected((s) => [...s, sportId]);
    if (!attrDefs[sportId]) {
      try {
        const defs = await getSportAttributes(sportId, 'PROFILE');
        setAttrDefs((d) => ({ ...d, [sportId]: defs.filter((x) => x.aggregation === 'NONE') }));
      } catch {
        setAttrDefs((d) => ({ ...d, [sportId]: [] }));
      }
    }
  };

  const setAttr = (sportId: string, key: string, value: unknown) =>
    setAttrValues((v) => ({ ...v, [sportId]: { ...(v[sportId] ?? {}), [key]: value } }));

  const next = async () => {
    setError(null);
    try {
      setSaving(true);
      if (step === 1) {
        if (!fullName || !dateOfBirth || !gender || !district) {
          setError('Please fill name, date of birth, gender and district.');
          return;
        }
        await saveOnboardingStep(1, { fullName, dateOfBirth, gender, district });
        setStep(2);
      } else if (step === 2) {
        if (selected.length === 0) {
          setError('Select at least one sport.');
          return;
        }
        const payloadSports = selected.map((sportId, i) => ({
          sportId,
          isPrimary: i === 0,
          attributes: Object.entries(attrValues[sportId] ?? {})
            .filter(([, val]) => val !== undefined && val !== '')
            .map(([key, value]) => ({ key, value })),
        }));
        await saveOnboardingStep(2, { sports: payloadSports });
        setStep(3);
      } else {
        await saveOnboardingStep(3, {
          yearsOfTraining: yearsOfTraining ? Number(yearsOfTraining) : undefined,
          currentAcademy: currentAcademy || undefined,
          currentCoach: currentCoach || undefined,
        });
        await completeOnboarding();
        router.replace('/home');
        return;
      }
    } catch (e) {
      setError((e as { message?: string }).message ?? 'Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const back = () => (step > 1 ? setStep((s) => s - 1) : router.back());

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={back} hitSlop={8} style={styles.iconBtn}>
          <Icon name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.stepLabel}>
          Step {step} of {TOTAL}
        </Text>
        <View style={styles.iconBtn} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(step / TOTAL) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <>
            <Text style={styles.title}>Tell us about you</Text>
            <Text style={styles.subtitle}>This builds your sports identity.</Text>
            <View style={styles.fields}>
              <TextField label="Full name" placeholder="e.g. Ravi Kumar" value={fullName} onChangeText={setFullName} />
              <DateField label="Date of birth" value={dateOfBirth} onChange={setDateOfBirth} minYear={currentYear - 70} maxYear={currentYear - 5} />
              <Select label="Gender" placeholder="Select gender" value={gender} options={GENDERS} onChange={setGender} />
              <Select
                label="District"
                placeholder="Select district"
                value={district}
                options={districts.map((d) => ({ value: d.code, label: d.name }))}
                onChange={setDistrict}
                icon="location-outline"
              />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Your sports</Text>
            <Text style={styles.subtitle}>Pick one or more — add details for each.</Text>
            <View style={styles.sportGrid}>
              {sports.map((sport) => {
                const on = selected.includes(sport.id);
                return (
                  <Pressable
                    key={sport.id}
                    onPress={() => toggleSport(sport.id)}
                    style={[styles.sportChip, on && styles.sportChipOn]}
                  >
                    <SportIcon sport={sport.name} size={22} color={on ? colors.primary : colors.textMuted} />
                    <Text style={[styles.sportChipText, on && styles.sportChipTextOn]}>{sport.name}</Text>
                    {on ? <Icon name="checkmark-circle" size={16} color={colors.primary} /> : null}
                  </Pressable>
                );
              })}
            </View>

            {selected.map((sportId) => {
              const sport = sports.find((s) => s.id === sportId);
              const defs = attrDefs[sportId];
              return (
                <View key={sportId} style={styles.sportSection}>
                  <View style={styles.sportSectionHead}>
                    <SportIcon sport={sport?.name ?? ''} size={18} color={colors.primary} />
                    <Text style={styles.sportSectionTitle}>{sport?.name}</Text>
                  </View>
                  {!defs ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <View style={styles.fields}>
                      {defs.map((def) => (
                        <DynamicField
                          key={def.id}
                          def={def}
                          value={attrValues[sportId]?.[def.key]}
                          onChange={(val) => setAttr(sportId, def.key, val)}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Training background</Text>
            <Text style={styles.subtitle}>Optional — you can edit this later.</Text>
            <View style={styles.fields}>
              <TextField label="Years of training" placeholder="e.g. 5" value={yearsOfTraining} onChangeText={setYearsOfTraining} keyboardType="number-pad" />
              <TextField label="Current academy" placeholder="e.g. Rohtak Akhara" value={currentAcademy} onChangeText={setCurrentAcademy} />
              <TextField label="Current coach" placeholder="e.g. Coach Singh" value={currentCoach} onChangeText={setCurrentCoach} />
            </View>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={saving ? 'Saving…' : step === TOTAL ? 'Finish' : 'Continue'}
          onPress={next}
          disabled={saving}
        />
      </View>
    </SafeAreaView>
  );
}

/** Renders the right input for an attribute definition's data type. */
function DynamicField({
  def,
  value,
  onChange,
}: {
  def: SportAttributeDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (def.dataType) {
    case 'ENUM':
      return (
        <Select
          label={def.label}
          placeholder={`Select ${def.label.toLowerCase()}`}
          value={value as string}
          options={def.options ?? []}
          onChange={onChange}
        />
      );
    case 'BOOLEAN':
      return (
        <Select
          label={def.label}
          placeholder="Select"
          value={value as string}
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          onChange={onChange}
        />
      );
    case 'DATE':
      return <DateField label={def.label} value={value as string} onChange={onChange} />;
    case 'NUMBER':
      return (
        <TextField
          label={def.unit ? `${def.label} (${def.unit})` : def.label}
          placeholder={def.label}
          value={value != null ? String(value) : ''}
          onChangeText={onChange}
          keyboardType="number-pad"
        />
      );
    default:
      return (
        <TextField
          label={def.label}
          placeholder={def.label}
          value={(value as string) ?? ''}
          onChangeText={onChange}
        />
      );
  }
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
  stepLabel: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textMuted },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surfaceAlt,
    marginHorizontal: spacing.lg,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: colors.primary },
  body: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  title: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textMuted, marginBottom: spacing.md },
  fields: { gap: spacing.md },
  sportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sportChipOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  sportChipText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textMuted },
  sportChipTextOn: { color: colors.primary },
  sportSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sportSectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sportSectionTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  error: { color: colors.danger, fontSize: fontSize.sm, marginTop: spacing.sm },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
