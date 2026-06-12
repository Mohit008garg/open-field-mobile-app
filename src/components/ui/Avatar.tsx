import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '@/theme';

const PALETTE = [
  '#16A34A',
  '#2563EB',
  '#9333EA',
  '#DB2777',
  '#EA580C',
  '#0891B2',
  '#CA8A04',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

type Props = {
  name: string;
  size?: number;
  online?: boolean;
  style?: ViewStyle;
};

/** Initials-based avatar (no network needed). */
export function Avatar({ name, size = 44, online, style }: Props) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colorFor(name),
          },
        ]}
      >
        <Text style={[styles.text, { fontSize: size * 0.4 }]}>
          {initials(name).toUpperCase()}
        </Text>
      </View>
      {online ? (
        <View
          style={[
            styles.dot,
            {
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
