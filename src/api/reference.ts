import { apiRequest } from './client';

export interface Sport {
  id: string;
  name: string;
}

export interface SportAttributeDefinition {
  id: string;
  key: string;
  label: string;
  dataType: 'NUMBER' | 'TEXT' | 'BOOLEAN' | 'ENUM' | 'DATE';
  unit: string | null;
  isRequired: boolean;
  defaultValue: string | null;
  options: { value: string; label: string }[] | null;
  scope: 'PROFILE' | 'MATCH';
  aggregation: string;
  sourceKey: string | null;
  displayOrder: number;
}

export interface DistrictRef {
  code: string;
  name: string;
  state: string;
}

/** Active sports from the backend. */
export function getSports(): Promise<Sport[]> {
  return apiRequest<Sport[]>('/sports');
}

/** Attribute definitions (form schema) for a sport, optionally filtered by scope. */
export function getSportAttributes(
  sportId: string,
  scope?: 'PROFILE' | 'MATCH',
): Promise<SportAttributeDefinition[]> {
  const q = scope ? `?scope=${scope}` : '';
  return apiRequest<SportAttributeDefinition[]>(`/sports/${sportId}/attributes${q}`);
}

export function getDistricts(): Promise<DistrictRef[]> {
  return apiRequest<DistrictRef[]>('/districts');
}
