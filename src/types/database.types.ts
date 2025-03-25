import Color from '../types/color.types';

export default interface TimeEntry {
  id: number;
  remoteId?: number;
  name: string;
  synced: boolean;
  tagId: number;
  tagName: string;
  tagColor: Color['color'];
  startTimeUtc: number;
  endTimeUtc: number;
  msg: string;
}
