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

export interface CountryRef {
  id: string;
  code: string;
  name: string;
}
export interface StateRef {
  id: string;
  name: string;
  code: string | null;
  countryId: string;
}
export interface CityRef {
  id: string;
  name: string;
  stateId: string;
}

/**
 * Active sports. Pass a cityId to get only sports active for that city or its
 * state (plus location-unrestricted sports); omit for all active sports.
 */
export function getSports(cityId?: string): Promise<Sport[]> {
  return apiRequest<Sport[]>(cityId ? `/sports?cityId=${cityId}` : '/sports');
}

/** Attribute definitions (form schema) for a sport, optionally filtered by scope. */
export function getSportAttributes(
  sportId: string,
  scope?: 'PROFILE' | 'MATCH',
): Promise<SportAttributeDefinition[]> {
  const q = scope ? `?scope=${scope}` : '';
  return apiRequest<SportAttributeDefinition[]>(`/sports/${sportId}/attributes${q}`);
}

export function getCountries(): Promise<CountryRef[]> {
  return apiRequest<CountryRef[]>('/countries');
}

export function getStates(countryId: string): Promise<StateRef[]> {
  return apiRequest<StateRef[]>(`/states?countryId=${countryId}`);
}

export function getCities(stateId: string): Promise<CityRef[]> {
  return apiRequest<CityRef[]>(`/cities?stateId=${stateId}`);
}
