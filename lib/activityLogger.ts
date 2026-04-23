export interface Activity {
  id: string;
  action: string;
  itemName: string;
  timestamp: string;
  details?: string;
}

const ACTIVITY_LOG_KEY = 'fileManagerActivityLog';
const MAX_ACTIVITIES = 50;

export const generateActivityId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const loadActivityLog = (): Activity[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load activity log:', error);
    return [];
  }
};

export const addActivity = (action: string, itemName: string, details?: string): Activity => {
  const activity: Activity = {
    id: generateActivityId(),
    action,
    itemName,
    timestamp: new Date().toLocaleString(),
    details,
  };

  const currentLog = loadActivityLog();
  const updatedLog = [activity, ...currentLog].slice(0, MAX_ACTIVITIES);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(updatedLog));
    } catch (error) {
      console.error('Failed to save activity log:', error);
    }
  }

  return activity;
};

export const clearActivityLog = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(ACTIVITY_LOG_KEY);
  } catch (error) {
    console.error('Failed to clear activity log:', error);
  }
};
