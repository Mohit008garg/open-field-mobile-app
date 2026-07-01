import { apiRequest } from './client';

/** A PROFILE-scope attribute value resolved against its definition. */
export interface ResolvedAttribute {
  key: string;
  label: string;
  dataType: 'NUMBER' | 'TEXT' | 'BOOLEAN' | 'ENUM' | 'DATE';
  unit: string | null;
  scope: 'PROFILE' | 'MATCH';
  aggregation: string;
  value: string | number | boolean | null;
  isDefault: boolean;
}

export interface PlayerSport {
  id: string;
  sportId: string;
  isPrimary: boolean;
  academyName: string | null;
  sport: { id: string; name: string };
  attributes: ResolvedAttribute[];
}

export interface Achievement {
  id: string;
  competitionName: string;
  year: number;
  level: 'DISTRICT' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL';
  position: 'GOLD' | 'SILVER' | 'BRONZE' | 'FOURTH' | 'PARTICIPATION';
  weightCategory: string | null;
  organizedBy: string | null;
  certificateUrl: string | null;
  isVerified: boolean;
}

export interface ProfileVideo {
  id: string;
  title: string;
  description: string | null;
  videoType: string;
  cdnUrl: string;
  thumbnailUrl: string | null;
  status: string;
  sortOrder: number;
}

export interface PlayerSkill {
  id: string;
  label: string;
  rating: number; // 0–100
  displayOrder: number;
}

export interface PlayerProfile {
  id: string;
  userId: string | null;
  fullName: string;
  displayName: string | null;
  bio: string | null;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  photoUrl: string | null;
  coverUrl: string | null;
  district: string;
  districtId: string;
  state: string;
  heightCm: number | null;
  weightKg: number | null;
  playingLevel: string | null;
  currentTeam: string | null;
  school: string | null;
  preferredFoot: string | null;
  jerseyNumber: number | null;
  profileViews: number;
  yearsOfTraining: number | null;
  currentAcademy: string | null;
  currentCoach: string | null;
  username: string;
  isPublic: boolean;
  profileScore: number;
  phone: string | null;
  whatsappNumber: string | null;
  email: string | null;
  playerSports: PlayerSport[];
  achievements: Achievement[];
  videos: ProfileVideo[];
  skills: PlayerSkill[];
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  photoUrl?: string;
  coverUrl?: string;
  heightCm?: number;
  weightKg?: number;
  playingLevel?: string;
  currentTeam?: string;
  school?: string;
  preferredFoot?: string;
  jerseyNumber?: number;
  yearsOfTraining?: number;
  currentAcademy?: string;
  currentCoach?: string;
  whatsappNumber?: string;
  email?: string;
  isPublic?: boolean;
}

/** The current player's full profile (sports, attributes, achievements, videos). */
export function getMyProfile(): Promise<PlayerProfile> {
  return apiRequest<PlayerProfile>('/profile/me', { auth: true });
}

/** Patch top-level profile fields. */
export function updateMyProfile(payload: UpdateProfilePayload): Promise<PlayerProfile> {
  return apiRequest<PlayerProfile>('/profile/me', {
    method: 'PUT',
    auth: true,
    body: payload,
  });
}

/** Replace the player's skill ratings. */
export function setMySkills(
  skills: { label: string; rating: number }[],
): Promise<PlayerProfile> {
  return apiRequest<PlayerProfile>('/profile/me/skills', {
    method: 'PUT',
    auth: true,
    body: { skills },
  });
}
