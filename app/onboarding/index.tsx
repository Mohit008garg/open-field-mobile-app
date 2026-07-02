import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
  getCities,
  getCountries,
  getMyProfile,
  getOnboardingProgress,
  getSportAttributes,
  getSports,
  getStates,
  saveOnboardingStep,
  setMySkills,
  type CityRef,
  type CompleteResult,
  type CountryRef,
  type Sport,
  type SportAttributeDefinition,
  type StateRef,
} from '@/api';
import { useProfile } from '@/context/ProfileContext';
import { colors, fontSize, radius, spacing } from '@/theme';

const TOTAL = 5;
const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];
const PLAYING_LEVELS = ['District', 'State', 'National', 'International', 'Club'].map((v) => ({
  value: v,
  label: v,
}));
const FOOT_OPTIONS = ['Right', 'Left', 'Both'].map((v) => ({ value: v, label: v }));
const DEFAULT_SKILLS = ['Speed', 'Stamina', 'Strength', 'Agility', 'Technique', 'Discipline'];
const currentYear = new Date().getFullYear();

type AttrValues = Record<string, Record<string, unknown>>; // sportId -> key -> value

export default function OnboardingScreen() {
  const router = useRouter();
  const { refresh } = useProfile();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<CompleteResult | null>(null);

  // Reference data
  const [sports, setSports] = useState<Sport[]>([]);
  const [countries, setCountries] = useState<CountryRef[]>([]);
  const [states, setStates] = useState<StateRef[]>([]);
  const [cities, setCities] = useState<CityRef[]>([]);
  const [attrDefs, setAttrDefs] = useState<Record<string, SportAttributeDefinition[]>>({});

  // Step 1
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [bio, setBio] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [playingLevel, setPlayingLevel] = useState('');
  const [preferredFoot, setPreferredFoot] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [currentTeam, setCurrentTeam] = useState('');
  const [school, setSchool] = useState('');

  // Skills (rating 0–100), edited in step 3. Defaults so the editor is usable
  // even before the backend has seeded a skill set.
  const [skills, setSkills] = useState<{ label: string; rating: string }[]>(
    DEFAULT_SKILLS.map((label) => ({ label, rating: '50' })),
  );

  // Step 2
  const [selected, setSelected] = useState<string[]>([]);
  const [attrValues, setAttrValues] = useState<AttrValues>({});
  const [primarySportId, setPrimarySportId] = useState<string>('');
  const [sportAcademies, setSportAcademies] = useState<Record<string, string>>({});

  // Step 3
  const [yearsOfTraining, setYearsOfTraining] = useState('');
  const [currentAcademy, setCurrentAcademy] = useState('');
  const [currentCoach, setCurrentCoach] = useState('');

  useEffect(() => {
    getCountries().then(setCountries).catch(() => undefined);
  }, []);

  // Resume where the user left off (server is the source of truth).
  useEffect(() => {
    getOnboardingProgress()
      .then((p) => {
        if (!p.isCompleted) setStep(Math.min(Math.max(p.currentStep, 1), TOTAL));
      })
      .catch(() => undefined);
  }, []);

  // Cascade: country → states, state → cities. Reset children on parent change.
  useEffect(() => {
    if (!countryId) {
      setStates([]);
      return;
    }
    getStates(countryId).then(setStates).catch(() => undefined);
    setStateId('');
    setCityId('');
  }, [countryId]);

  useEffect(() => {
    if (!stateId) {
      setCities([]);
      return;
    }
    getCities(stateId).then(setCities).catch(() => undefined);
    setCityId('');
  }, [stateId]);

  // Only show sports activated for the chosen city/state (plus unrestricted ones).
  useEffect(() => {
    getSports(cityId || undefined)
      .then(setSports)
      .catch(() => undefined);
  }, [cityId]);

  // Prefill with the existing profile so re-opening "Edit profile" shows saved
  // values. New users (no profile yet → 404) just start with empty fields.
  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        setFullName(p.fullName ?? '');
        setDateOfBirth(p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '');
        setGender(p.gender ?? '');
        setCountryId(p.location?.country?.id ?? '');
        setStateId(p.location?.state?.id ?? '');
        setCityId(p.location?.city?.id ?? '');
        setBio(p.bio ?? '');
        setCoverUrl(p.coverUrl ?? '');
        setHeightCm(p.heightCm != null ? String(p.heightCm) : '');
        setWeightKg(p.weightKg != null ? String(p.weightKg) : '');
        setPlayingLevel(p.playingLevel ?? '');
        setPreferredFoot(p.preferredFoot ?? '');
        setJerseyNumber(p.jerseyNumber != null ? String(p.jerseyNumber) : '');
        setCurrentTeam(p.currentTeam ?? '');
        setSchool(p.school ?? '');
        setYearsOfTraining(p.yearsOfTraining != null ? String(p.yearsOfTraining) : '');
        setCurrentAcademy(p.currentAcademy ?? '');
        setCurrentCoach(p.currentCoach ?? '');
        if (p.skills?.length) {
          setSkills(p.skills.map((s) => ({ label: s.label, rating: String(s.rating) })));
        }

        if (p.playerSports?.length) {
          const ordered = [...p.playerSports].sort(
            (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
          );
          setSelected(ordered.map((ps) => ps.sportId));
          setPrimarySportId(
            (ordered.find((ps) => ps.isPrimary) ?? ordered[0]).sportId,
          );
          const defs: Record<string, SportAttributeDefinition[]> = {};
          const values: AttrValues = {};
          const academies: Record<string, string> = {};
          for (const ps of ordered) {
            values[ps.sportId] = {};
            if (ps.academyName) academies[ps.sportId] = ps.academyName;
            for (const attr of ps.attributes) {
              if (attr.aggregation === 'NONE' && !attr.isDefault && attr.value != null) {
                values[ps.sportId][attr.key] = attr.value;
              }
            }
            try {
              const d = await getSportAttributes(ps.sportId, 'PROFILE');
              defs[ps.sportId] = d.filter((x) => x.showInOnboarding);
            } catch {
              defs[ps.sportId] = [];
            }
          }
          setAttrDefs(defs);
          setAttrValues(values);
          setSportAcademies(academies);
        }
      } catch {
        // No existing profile — fresh onboarding.
      }
    })();
  }, []);

  const toggleSport = async (sportId: string) => {
    setError(null);
    if (selected.includes(sportId)) {
      const remaining = selected.filter((id) => id !== sportId);
      setSelected(remaining);
      // If the primary sport was removed, fall back to the first remaining one.
      setPrimarySportId((cur) => (cur === sportId ? remaining[0] ?? '' : cur));
      return;
    }
    setSelected((s) => [...s, sportId]);
    // First sport selected becomes primary by default.
    setPrimarySportId((cur) => cur || sportId);
    if (!attrDefs[sportId]) {
      try {
        const defs = await getSportAttributes(sportId, 'PROFILE');
        setAttrDefs((d) => ({ ...d, [sportId]: defs.filter((x) => x.showInOnboarding) }));
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
        if (!fullName || !dateOfBirth || !gender || !countryId || !stateId || !cityId) {
          setError('Please fill name, date of birth, gender and country/state/city.');
          return;
        }
        await saveOnboardingStep(1, {
          fullName,
          dateOfBirth,
          gender,
          countryId,
          stateId,
          cityId,
          bio: bio || undefined,
          coverUrl: coverUrl.trim() || undefined,
          heightCm: heightCm ? Number(heightCm) : undefined,
          weightKg: weightKg ? Number(weightKg) : undefined,
          playingLevel: playingLevel || undefined,
          preferredFoot: preferredFoot || undefined,
          jerseyNumber: jerseyNumber ? Number(jerseyNumber) : undefined,
          currentTeam: currentTeam || undefined,
          school: school || undefined,
        });
        setStep(2);
      } else if (step === 2) {
        if (selected.length === 0) {
          setError('Select at least one sport.');
          return;
        }
        const primaryId = primarySportId || selected[0];
        const payloadSports = selected.map((sportId) => ({
          sportId,
          isPrimary: sportId === primaryId,
          academy: sportAcademies[sportId]?.trim() || undefined,
          attributes: Object.entries(attrValues[sportId] ?? {})
            .filter(([, val]) => val !== undefined && val !== '')
            .map(([key, value]) => ({ key, value })),
        }));
        await saveOnboardingStep(2, { sports: payloadSports });
        setStep(3);
      } else if (step === 3) {
        await saveOnboardingStep(3, {
          yearsOfTraining: yearsOfTraining ? Number(yearsOfTraining) : undefined,
          currentAcademy: currentAcademy || undefined,
          currentCoach: currentCoach || undefined,
        });
        // Persist skill ratings (clamped 0–100).
        const skillPayload = skills
          .filter((s) => s.label.trim())
          .map((s) => ({
            label: s.label.trim(),
            rating: Math.max(0, Math.min(100, Number(s.rating) || 0)),
          }));
        if (skillPayload.length) {
          await setMySkills(skillPayload).catch(() => undefined);
        }
        setStep(4);
      } else if (step === 4) {
        // Achievements are skippable during onboarding.
        await saveOnboardingStep(4, { skip: true });
        setStep(5);
      } else {
        // Step 5 (video) is skippable — record it, then complete.
        await saveOnboardingStep(5, { skip: true });
        const result = await completeOnboarding();
        await refresh();
        setDone(result);
        return;
      }
    } catch (e) {
      setError((e as { message?: string }).message ?? 'Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const back = () => (step > 1 ? setStep((s) => s - 1) : router.back());

  if (done) return <AhaMoment result={done} onGo={() => router.replace('/home')} />;

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
                label="Country"
                placeholder="Select country"
                value={countryId}
                options={countries.map((c) => ({ value: c.id, label: c.name }))}
                onChange={setCountryId}
                icon="location-outline"
              />
              <Select
                label="State"
                placeholder={countryId ? 'Select state' : 'Select a country first'}
                value={stateId}
                options={states.map((s) => ({ value: s.id, label: s.name }))}
                onChange={setStateId}
                icon="location-outline"
              />
              <Select
                label="City"
                placeholder={stateId ? 'Select city' : 'Select a state first'}
                value={cityId}
                options={cities.map((c) => ({ value: c.id, label: c.name }))}
                onChange={setCityId}
                icon="location-outline"
              />
              <View style={styles.row}>
                <View style={styles.flex}>
                  <TextField
                    label="Height (cm)"
                    placeholder="e.g. 175"
                    value={heightCm}
                    onChangeText={setHeightCm}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.flex}>
                  <TextField
                    label="Weight (kg)"
                    placeholder="e.g. 68"
                    value={weightKg}
                    onChangeText={setWeightKg}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <TextField
                label="Short bio"
                placeholder="A line about you as an athlete"
                value={bio}
                onChangeText={setBio}
                maxLength={300}
              />
              <TextField
                label="Cover photo URL"
                placeholder="https://…/your-cover.jpg"
                value={coverUrl}
                onChangeText={setCoverUrl}
                autoCapitalize="none"
              />
              <Select
                label="Playing level"
                placeholder="Select level"
                value={playingLevel}
                options={PLAYING_LEVELS}
                onChange={setPlayingLevel}
              />
              <View style={styles.row}>
                <View style={styles.flex}>
                  <Select
                    label="Preferred foot/hand"
                    placeholder="Select"
                    value={preferredFoot}
                    options={FOOT_OPTIONS}
                    onChange={setPreferredFoot}
                  />
                </View>
                <View style={styles.flex}>
                  <TextField
                    label="Jersey no."
                    placeholder="e.g. 8"
                    value={jerseyNumber}
                    onChangeText={setJerseyNumber}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <TextField
                label="Current team"
                placeholder="e.g. Bangalore United FC"
                value={currentTeam}
                onChangeText={setCurrentTeam}
              />
              <TextField
                label="School / College"
                placeholder="e.g. St. Joseph's College"
                value={school}
                onChangeText={setSchool}
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
              const isPrimary = primarySportId === sportId;
              return (
                <View key={sportId} style={styles.sportSection}>
                  <View style={styles.sportSectionHead}>
                    <SportIcon sport={sport?.name ?? ''} size={18} color={colors.primary} />
                    <Text style={styles.sportSectionTitle}>{sport?.name}</Text>
                    <Pressable
                      onPress={() => setPrimarySportId(sportId)}
                      hitSlop={8}
                      style={[styles.primaryChip, isPrimary && styles.primaryChipOn]}
                    >
                      <Icon
                        name="star"
                        size={14}
                        color={isPrimary ? colors.primary : colors.textFaint}
                      />
                      <Text style={[styles.primaryChipText, isPrimary && styles.primaryChipTextOn]}>
                        {isPrimary ? 'Primary' : 'Set primary'}
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.fields}>
                    <TextField
                      label="Academy / club"
                      placeholder="e.g. Rohtak Akhara"
                      value={sportAcademies[sportId] ?? ''}
                      onChangeText={(val) =>
                        setSportAcademies((a) => ({ ...a, [sportId]: val }))
                      }
                    />
                    {!defs ? (
                      <ActivityIndicator color={colors.primary} />
                    ) : (
                      defs.map((def) => (
                        <DynamicField
                          key={def.id}
                          def={def}
                          value={attrValues[sportId]?.[def.key]}
                          onChange={(val) => setAttr(sportId, def.key, val)}
                        />
                      ))
                    )}
                  </View>
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

            {skills.length ? (
              <View style={styles.skillsBlock}>
                <Text style={styles.sportSectionTitle}>Skills (0–100)</Text>
                {skills.map((s, i) => (
                  <View key={s.label} style={styles.skillEditRow}>
                    <Text style={styles.skillEditLabel}>{s.label}</Text>
                    <View style={styles.skillEditInput}>
                      <TextField
                        value={s.rating}
                        onChangeText={(val) =>
                          setSkills((arr) =>
                            arr.map((x, j) => (j === i ? { ...x, rating: val.replace(/[^0-9]/g, '') } : x)),
                          )
                        }
                        keyboardType="number-pad"
                        maxLength={3}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>Your first achievement</Text>
            <Text style={styles.subtitle}>
              Won a medal or tournament? You can add achievements now or later from your profile.
            </Text>
            <View style={styles.optionalCard}>
              <Icon name="trophy-outline" size={28} color={colors.primary} />
              <Text style={styles.optionalText}>
                This step is optional — tap Continue to skip and add achievements anytime.
              </Text>
            </View>
          </>
        )}

        {step === 5 && (
          <>
            <Text style={styles.title}>Your first video</Text>
            <Text style={styles.subtitle}>
              Highlight clips make your profile shine. You can upload videos later from your profile.
            </Text>
            <View style={styles.optionalCard}>
              <Icon name="image-outline" size={28} color={colors.primary} />
              <Text style={styles.optionalText}>
                This step is optional — tap Finish to complete your profile and add videos anytime.
              </Text>
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

/** Celebratory profile-reveal shown right after onboarding completes (#16). */
function AhaMoment({ result, onGo }: { result: CompleteResult; onGo: () => void }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.aha}>
        <Icon name="checkmark-circle" size={84} color={colors.primary} />
        <Text style={styles.ahaTitle}>You&apos;re on Open Field! 🎉</Text>
        <Text style={styles.ahaSubtitle}>
          {result.profile.fullName}, your athlete profile is live — score{' '}
          {result.profile.profileScore}.
        </Text>
        <View style={styles.ahaUrlCard}>
          <Text style={styles.ahaUrlLabel}>Your public profile</Text>
          <Text style={styles.ahaUrl}>{result.profileUrl}</Text>
        </View>
        <View style={styles.ahaActions}>
          <PrimaryButton
            label="Share on WhatsApp"
            onPress={() => Linking.openURL(result.whatsappShareLink).catch(() => undefined)}
          />
          <Pressable
            style={styles.ahaSecondary}
            onPress={() => Linking.openURL(result.profileUrl).catch(() => undefined)}
          >
            <Text style={styles.ahaSecondaryText}>View Sports CV</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Go to my profile" onPress={onGo} />
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
          options={(def.options ?? []).map((o) => ({ value: o.value, label: o.label || o.value }))}
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
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
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
  primaryChip: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryChipOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  primaryChipText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted },
  primaryChipTextOn: { color: colors.primary },
  skillsBlock: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  skillEditRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  skillEditLabel: { flex: 1, fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  skillEditInput: { width: 90 },
  error: { color: colors.danger, fontSize: fontSize.sm, marginTop: spacing.sm },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  optionalText: { flex: 1, fontSize: fontSize.sm, color: colors.textMuted },
  aha: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  ahaTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  ahaSubtitle: { fontSize: fontSize.md, color: colors.textMuted, textAlign: 'center' },
  ahaUrlCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  ahaUrlLabel: { fontSize: fontSize.xs, color: colors.textMuted },
  ahaUrl: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
  ahaActions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.lg },
  ahaSecondary: { alignItems: 'center', paddingVertical: spacing.sm },
  ahaSecondaryText: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
});
