import { Injectable } from '@angular/core';
import { z } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getItem<T>(key: string, schema: z.ZodType<T, any, any>, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return fallback;
      }
      const parsed = JSON.parse(item);
      const validation = schema.safeParse(parsed);
      if (validation.success) {
        return validation.data;
      }
      console.warn(`Zod schema mismatch for key "${key}":`, validation.error);
      return fallback;
    } catch (err) {
      console.error(`Error reading key "${key}" from localStorage:`, err);
      return fallback;
    }
  }

  setItem<T>(key: string, value: T, schema?: z.ZodType<any, any, any>): boolean {
    try {
      if (schema) {
        const validation = schema.safeParse(value);
        if (!validation.success) {
          console.error(`Cannot save invalid data to "${key}":`, validation.error);
          return false;
        }
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error writing key "${key}" to localStorage:`, err);
      return false;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing key "${key}" from localStorage:`, err);
    }
  }
}
