import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COST_GENERATE_DECK,
  COST_REGENERATE_SLIDE,
  DAILY_AI_QUOTA_MAX,
  QUOTA_STORAGE_KEY,
  type StorageLike,
  canSpendQuota,
  getLocalDateKey,
  loadQuotaState,
  spendQuota,
} from './quotaLogic';

function createMemoryStorage(initial: Record<string, string> = {}): StorageLike {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, val) => {
      map.set(key, val);
    },
  };
}

test('loadQuotaState initializes daily max and resets on a new day', () => {
  const day1 = new Date(2026, 10, 20, 9, 0, 0);
  const day2 = new Date(2026, 10, 21, 8, 0, 0);
  const storage = createMemoryStorage();

  const initial = loadQuotaState(storage, day1);
  assert.equal(initial.remaining, DAILY_AI_QUOTA_MAX);
  assert.equal(initial.date, getLocalDateKey(day1));

  const afterSpend = spendQuota(initial, COST_GENERATE_DECK, storage, day1);
  assert.equal(afterSpend.remaining, DAILY_AI_QUOTA_MAX - COST_GENERATE_DECK);

  const reloadedSameDay = loadQuotaState(storage, day1);
  assert.equal(reloadedSameDay.remaining, DAILY_AI_QUOTA_MAX - COST_GENERATE_DECK);

  const nextDayReset = loadQuotaState(storage, day2);
  assert.equal(nextDayReset.remaining, DAILY_AI_QUOTA_MAX);
  assert.equal(nextDayReset.date, getLocalDateKey(day2));
});

test('canSpendQuota blocks when points are insufficient and recovers on next day', () => {
  const day1 = new Date(2026, 10, 20, 10, 0, 0);
  const day2 = new Date(2026, 10, 21, 10, 0, 0);
  const storage = createMemoryStorage({
    [QUOTA_STORAGE_KEY]: JSON.stringify({
      date: getLocalDateKey(day1),
      remaining: 2,
    }),
  });

  const state = loadQuotaState(storage, day1);
  const genCheck = canSpendQuota(state, COST_GENERATE_DECK, day1);
  assert.equal(genCheck.ok, false);
  assert.ok(genCheck.error?.includes('cần 3 điểm'));

  const regenCheck = canSpendQuota(state, COST_REGENERATE_SLIDE, day1);
  assert.equal(regenCheck.ok, true);

  const nextDayCheck = canSpendQuota(state, COST_GENERATE_DECK, day2);
  assert.equal(nextDayCheck.ok, true);
  assert.equal(nextDayCheck.effectiveState.remaining, DAILY_AI_QUOTA_MAX);
});
