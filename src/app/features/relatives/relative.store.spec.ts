import { TestBed } from '@angular/core/testing';
import { Relative } from './relative.schema';
import { RelativesStore } from './relative.store';

describe('RelativesStore (NgRx Signals)', () => {
  let store: typeof RelativesStore.prototype;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(RelativesStore);
    store.initialize();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with mock relatives', () => {
    expect(store.totalCount()).toBeGreaterThan(0);
    expect(store.groomSideCount()).toBeGreaterThan(0);
    expect(store.brideSideCount()).toBeGreaterThan(0);
  });

  it('should filter relatives by side', () => {
    store.setSide('GROOM');
    const filtered = store.filteredRelatives();
    expect(filtered.every((r: Relative) => r.side === 'GROOM' || r.side === 'COMMON')).toBeTrue();
  });

  it('should add a valid relative and update counts', () => {
    const beforeCount = store.totalCount();
    const result = store.addRelative({
      name: 'Test Chachi Ji',
      relationTitle: 'Paternal Aunt',
      side: 'GROOM',
      category: 'EXTENDED_FAMILY',
      avatarEmoji: '👩',
      city: 'Jaipur',
      isVIP: false,
    });

    expect(result.success).toBeTrue();
    expect(store.totalCount()).toEqual(beforeCount + 1);
  });

  it('should reject invalid relative data according to Zod schema', () => {
    const result = store.addRelative({
      name: 'A', // Violates min(2)
      relationTitle: '',
      side: 'GROOM',
      category: 'EXTENDED_FAMILY',
      avatarEmoji: '👩',
      city: '',
      isVIP: false,
    });

    expect(result.success).toBeFalse();
    expect(result.error).toBeDefined();
  });
});
