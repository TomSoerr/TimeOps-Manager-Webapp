import TimeEntry from '../types/database.types';

// Constants for time calculations
export const SECONDS_PER_DAY = 86400; // 24 * 60 * 60
export const SECONDS_PER_WEEK = 7 * SECONDS_PER_DAY; // one week

// time zone offset in unix epoch seconds
export const offset = new Date().getTimezoneOffset() * 60;

// Get current time in unix epoch seconds (UTC)
const nowInSeconds = Math.floor(Date.now() / 1000);

const currentDayOfWeek = new Date().getDay();
const daysToSubtract = (currentDayOfWeek + 6) % 7;

export const start =
  nowInSeconds -
  (nowInSeconds % SECONDS_PER_DAY) -
  daysToSubtract * SECONDS_PER_DAY +
  offset; // offset is need for edge cases

export const sumUpHours = (entries: TimeEntry[]) => {
  const totalSeconds = entries.reduce(
    (acc, entry) => acc + (entry.endTimeUtc - entry.startTimeUtc),
    0,
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatTime = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

export const epochToHHMM = (epoch: number): string => {
  const date = new Date(epoch * 1000);
  return formatTime(date);
};

export const epochToYYMMDD = (epoch: number): string => {
  const date = new Date(epoch * 1000 - offset * 1000);
  return date.toISOString().split('T')[0];
};

export const dateToEpoch = (date: string, time: string): number => {
  const [year, month, day] = date.split('-');
  const [hours, minutes, seconds = '0'] = time.split(':');
  const jsDate = new Date();
  jsDate.setFullYear(+year);
  jsDate.setMonth(+month - 1);
  jsDate.setDate(+day);
  jsDate.setHours(+hours);
  jsDate.setMinutes(+minutes);
  jsDate.setSeconds(+seconds);
  return Math.floor(jsDate.getTime() / 1000);
};

export const Weekday = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};
