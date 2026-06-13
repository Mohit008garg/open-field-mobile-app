import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Card } from '@mohit008garg/open-field-common-components';
import { colors, fontSize, spacing } from '@/theme';
import type { Academy } from '@/types';

type Props = {
  academy: Academy;
  /** Seed for the banner placeholder image. */
  seed: string | number;
};

export function AcademyCard({ academy, seed }: Props) {
  return (
    <Card style={styles.card} padded={false}>
      <ImageBackground
        source={{ uri: `https://picsum.photos/seed/acad${seed}/400/220` }}
        style={styles.img}
      />
      <View style={styles.body}>
        <Text style={styles.name}>{academy.name}</Text>
        <View style={styles.locRow}>
          <Ionicons name="location-outline" size={12} color={colors.textFaint} />
          <Text style={styles.loc}>{academy.location}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.star} />
          <Text style={styles.rating}>{academy.rating}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: 220, overflow: 'hidden' },
  img: { height: 96, backgroundColor: colors.surfaceAlt },
  body: { padding: spacing.md, gap: 4 },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  loc: { fontSize: 11, color: colors.textFaint },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
});
