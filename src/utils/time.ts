import DatabaseEntry from '../types/database.types';

// Constants for time calculations
const SECONDS_PER_DAY = 86400; // 24 * 60 * 60
const DAYS_SINCE_EPOCH_TO_MONDAY = 3; // Thu->Mon = 3 days
export const interval = 7 * SECONDS_PER_DAY; // one week

// time zone offset in unix epoch seconds
export const offset = new Date().getTimezoneOffset() * 60;

// current time in unix epoch seconds
const now = Math.floor(Date.now() / 1000);

// last monday in current time zone in unix epoch seconds
export const start =
  now -
  (now % interval) -
  DAYS_SINCE_EPOCH_TO_MONDAY * SECONDS_PER_DAY +
  offset;

export const calculateWeekHours = (entries: DatabaseEntry[]) => {
  const totalSeconds = entries.reduce(
    (acc, entry) => acc + (entry.endTimeUtc - entry.startTimeUtc),
    0,
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

export const formatTime = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const epochToHHMM = (epoch: number): string => {
  const date = new Date(epoch * 1000);
  return formatTime(date);
};

export const epochToYYMMDD = (epoch: number): string => {
  const date = new Date(epoch * 1000);
  return date.toISOString().split('T')[0];
};

export const dateToEpoch = (date: string, time: string): number => {
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  const jsDate = new Date();
  jsDate.setFullYear(+year);
  jsDate.setMonth(+month - 1);
  jsDate.setDate(+day);
  jsDate.setHours(+hours);
  jsDate.setMinutes(+minutes);
  return Math.floor(jsDate.getTime() / 1000);
};
