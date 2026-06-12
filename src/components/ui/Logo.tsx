import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

type Props = {
  size?: number;
  /** Show the "OpenField" wordmark next to the badge. */
  wordmark?: boolean;
  /** Use white wordmark text (for placing over images). */
  light?: boolean;
};

export function Logo({ size = 32, wordmark = true, light = false }: Props) {
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.badge,
          { width: size, height: size, borderRadius: size * 0.3 },
        ]}
      >
        <Ionicons name="leaf" size={size * 0.62} color={colors.textInverse} />
      </View>
      {wordmark ? (
        <Text
          style={[
            styles.word,
            { fontSize: size * 0.62 },
            light && { color: colors.textInverse },
          ]}
        >
          OpenField
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  word: {
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
});
