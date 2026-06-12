/**
 * OpenField — Sports Networking palette.
 * Vibrant green primary on clean white/slate surfaces.
 */
export const colors = {
  primary: '#16A34A', // green-600
  primaryDark: '#15803D', // green-700
  primaryTint: '#DCFCE7', // green-100
  primarySoft: '#F0FDF4', // green-50

  // Social
  facebook: '#1877F2',
  apple: '#000000',

  background: '#F8FAFC', // slate-50
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9', // slate-100

  text: '#0F172A', // slate-900
  textMuted: '#64748B', // slate-500
  textFaint: '#94A3B8', // slate-400
  textInverse: '#FFFFFF',

  border: '#E2E8F0', // slate-200
  borderFocus: '#16A34A',

  star: '#F59E0B', // amber-500
  danger: '#EF4444',
  online: '#22C55E',

  overlay: 'rgba(15,23,42,0.5)',
} as const;

export type AppColors = typeof colors;
