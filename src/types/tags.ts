import Color from './color.types';

/**
 * Represents a tag entry in the application
 * @interface TagEntry
 * @property {number} id - Unique identifier for the tag
 * @property {string} name - Display name of the tag
 * @property {string} color - Color code associated with the tag
 */
export interface TagEntry {
  id: number;
  name: string;
  color: Color['color'];
}
