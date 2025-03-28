import Color from '../types/color.types';

export interface TagEntry {
  id: number;
  name: string;
  color: Color['color'];
}

export interface Running {
  name: string;
  synced: 0 | 1;
  tagId: number;
  startTimeUtc: number;
  msg: string;
}

export interface Entry extends Running {
  endTimeUtc: number;
  id?: number | undefined;
  remoteId?: number;
}

export interface analyticsItem {
  label: string;
  value: string;
}

export interface AnalyticsData {
  day: analyticsItem[];
  week: analyticsItem[];
  month: analyticsItem[];
  tags: analyticsItem[];
}
