import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { HandlerNode } from '../../types';

/** Versioned local activity state; each field is validated before reuse. */
export function useActivityState<T>(key: string, initial: T, validate: (value: unknown) => value is T): [T, Dispatch<SetStateAction<T>>, boolean] {
  const storageKey = `cor-operation-v2:${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) { const parsed: unknown = JSON.parse(stored); if (validate(parsed)) return parsed; }
    } catch { /* Missing or unavailable storage starts a usable local session. */ }
    return initial;
  });
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); setAvailable(true); }
    catch { setAvailable(false); }
  }, [storageKey, value]);
  return [value, setValue, available];
}
export const isString = (v: unknown): v is string => typeof v === 'string';
export const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';
export function isHandlerList(v: unknown): v is HandlerNode[] {
  return Array.isArray(v) && v.length > 0 && v.length <= 30 && v.every(h => h &&
    ['id', 'name', 'role', 'description', 'actionSummary', 'canHandleConditionText', 'avatarIcon'].every(key => typeof h[key] === 'string') &&
    ['lte', 'gte', 'eq'].includes(h.operator) && Number.isFinite(h.threshold) && typeof h.stopOnHandle === 'boolean');
}
