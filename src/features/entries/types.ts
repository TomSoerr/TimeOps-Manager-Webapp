/**
 * Data structure for time entry form inputs
 */
export interface FormData {
  /** Entry ID if editing an existing entry */
  id?: number;
  /** Name/description of the time entry */
  name: string;
  /** Start date in ISO format (YYYY-MM-DD) */
  startDate: string;
  /** End date in ISO format (YYYY-MM-DD), optional for running entries */
  endDate?: string;
  /** Start time in 24-hour format (HH:MM) */
  startTime: string;
  /** End time in 24-hour format (HH:MM), optional for running entries */
  endTime?: string;
  /** ID of the associated tag/project */
  tagId: number;
  /** Flag indicating if this is a running entry */
  running?: true;
}
