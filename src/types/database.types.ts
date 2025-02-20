import Color from '../types/color.types';

export default interface DatabaseEntry {
  'id': number;
  'name': string;
  'synced': boolean;
  'tag': string;
  'color': Color['color'];
  'start-time-utc': number;
  'end-time-utc': number;
}
