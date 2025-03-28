import Color from '../types/color.types';

export interface TimeRunningEntry {
  name: string;
  synced: boolean;
  tagId: number;
  tagName: string;
  tagColor: Color['color'];
  startTimeUtc: number;
  endTimeUtc: number;
  msg: string;
}

export default interface TimeEntry extends TimeRunningEntry {
  remoteId?: number;
  id: number;
  endTimeUtc: number;
}
