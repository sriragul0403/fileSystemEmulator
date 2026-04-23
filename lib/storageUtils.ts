import { FileSystemItem } from './fileSystemUtils';

const STORAGE_KEY = 'fileManagerState';
const RECYCLE_BIN_KEY = 'fileManagerRecycleBin';

export interface StorageState {
  items: FileSystemItem[];
  recycleBin: FileSystemItem[];
}

export const loadState = (): StorageState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load state from storage:', error);
    return null;
  }
};

export const saveState = (items: FileSystemItem[], recycleBin: FileSystemItem[]): void => {
  if (typeof window === 'undefined') return;

  try {
    const state: StorageState = { items, recycleBin };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to storage:', error);
  }
};

export const loadRecycleBin = (): FileSystemItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(RECYCLE_BIN_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load recycle bin from storage:', error);
    return [];
  }
};

export const saveRecycleBin = (items: FileSystemItem[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(RECYCLE_BIN_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save recycle bin to storage:', error);
  }
};

export const clearStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RECYCLE_BIN_KEY);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};
