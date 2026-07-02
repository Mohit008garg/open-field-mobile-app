import { apiRequest } from './client';
import type { PlayerProfile } from './profile';

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
}

export interface CompleteResult {
  profile: PlayerProfile;
  profileUrl: string;
  whatsappShareLink: string;
}

export interface AttributeItem {
  key: string;
  value: unknown;
}

export interface OnboardingSport {
  sportId: string;
  isPrimary?: boolean;
  academy?: string;
  attributes?: AttributeItem[];
}

export interface SaveStepPayload {
  // step 1
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
  photoUrl?: string;
  bio?: string;
  coverUrl?: string;
  heightCm?: number;
  weightKg?: number;
  playingLevel?: string;
  currentTeam?: string;
  school?: string;
  preferredFoot?: string;
  jerseyNumber?: number;
  // step 2
  sports?: OnboardingSport[];
  // step 3
  yearsOfTraining?: number;
  currentAcademy?: string;
  currentCoach?: string;
  // steps 4 & 5 — skippable
  skip?: boolean;
}

export function getOnboardingProgress(): Promise<OnboardingProgress> {
  return apiRequest<OnboardingProgress>('/onboarding/progress', { auth: true });
}

export function saveOnboardingStep(step: number, payload: SaveStepPayload) {
  return apiRequest<{ success: boolean; nextStep: number; profileScore: number }>(
    `/onboarding/step/${step}`,
    { method: 'POST', auth: true, body: payload },
  );
}

export function completeOnboarding(): Promise<CompleteResult> {
  return apiRequest<CompleteResult>('/onboarding/complete', { method: 'POST', auth: true });
}
