import { apiRequest } from './client';

export interface Sport {
  id: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
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
  id: string;
  code: string;
  name: string;
  state: string;
}

/**
 * Active sports. Pass a districtId to get only sports active for that district
 * (plus location-unrestricted sports); omit for all active sports.
 */
export function getSports(districtId?: string): Promise<Sport[]> {
  return apiRequest<Sport[]>(districtId ? `/sports?districtId=${districtId}` : '/sports');
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
