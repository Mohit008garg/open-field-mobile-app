import { apiRequest, apiUpload } from './client';
import type { UploadAsset } from './profile';

export type CompetitionLevel = 'DISTRICT' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL';
export type Position = 'GOLD' | 'SILVER' | 'BRONZE' | 'FOURTH' | 'PARTICIPATION';

export const COMPETITION_LEVELS: CompetitionLevel[] = [
  'DISTRICT',
  'STATE',
  'NATIONAL',
  'INTERNATIONAL',
];
export const POSITIONS: Position[] = ['GOLD', 'SILVER', 'BRONZE', 'FOURTH', 'PARTICIPATION'];

export interface CreateAchievementBody {
  playerSportId?: string;
  competitionName: string;
  year: number;
  level: CompetitionLevel;
  position: Position;
  weightCategory?: string;
  organizedBy?: string;
}

export interface Achievement extends CreateAchievementBody {
  id: string;
  photoUrl: string | null;
}

export function createAchievement(body: CreateAchievementBody): Promise<Achievement> {
  return apiRequest<Achievement>('/achievements', { method: 'POST', auth: true, body });
}

export function uploadAchievementPhoto(
  id: string,
  asset: UploadAsset,
): Promise<{ photoUrl: string }> {
  const fd = new FormData();
  fd.append('photo', asset as unknown as Blob);
  return apiUpload<{ photoUrl: string }>(`/achievements/${id}/photo`, fd);
}
