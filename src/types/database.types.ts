import Color from '../types/color.types';

export default interface DatabaseEntry {
  id: number;
  name: string;
  synced: boolean;
  tagName: string;
  tagColor: Color['color'];
  startTimeUtc: number;
  endTimeUtc: number;
}
