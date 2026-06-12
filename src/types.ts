import type { Ionicons } from '@expo/vector-icons';

/** Any valid Ionicons glyph name. */
export type IconName = keyof typeof Ionicons.glyphMap;

export type Player = {
  name: string;
  role: string;
  age: number;
  location: string;
};

export type Academy = {
  name: string;
  location: string;
  rating: number;
};

export type Connection = {
  name: string;
  role: string;
  status: string;
};

export type Opportunity = {
  title: string;
  org: string;
  location: string;
  date: string;
  tag: string;
};

export type EventItem = {
  month: string;
  day: string;
  title: string;
  location: string;
  dates: string;
};

export type Message = {
  name: string;
  text: string;
  time: string;
  unread: boolean;
};
