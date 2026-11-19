import { TestBed } from '@angular/core/testing';
import { z } from 'zod';
import { StorageService } from './storage.service';

describe('StorageService (Zod validation)', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const TestSchema = z.object({
    id: z.string(),
    count: z.number().min(1),
  });

  it('should return fallback when key does not exist', () => {
    const fallback = { id: 'default', count: 5 };
    const result = service.getItem('non_existent', TestSchema, fallback);
    expect(result).toEqual(fallback);
  });

  it('should return parsed item when stored value conforms to Zod schema', () => {
    const valid = { id: 'item-1', count: 10 };
    service.setItem('valid_key', valid, TestSchema);

    const result = service.getItem('valid_key', TestSchema, { id: 'fallback', count: 1 });
    expect(result).toEqual(valid);
  });

  it('should safely return fallback when stored value violates Zod schema', () => {
    // Malformed data: count is negative (< 1)
    localStorage.setItem('corrupt_key', JSON.stringify({ id: 'item-2', count: -10 }));

    const fallback = { id: 'safe_fallback', count: 99 };
    const result = service.getItem('corrupt_key', TestSchema, fallback);
    expect(result).toEqual(fallback);
  });
});
