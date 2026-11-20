// Cấu hình hạn mức điểm AI mỗi ngày (dễ dàng điều chỉnh tại đây)
export const DAILY_AI_QUOTA_MAX = 10;
export const COST_GENERATE_DECK = 3;
export const COST_REGENERATE_SLIDE = 1;
export const QUOTA_STORAGE_KEY = 'slideforge_ai_daily_quota_v1';

export interface QuotaState {
  date: string; // YYYY-MM-DD (local time)
  remaining: number;
}

export interface StorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export function getLocalDateKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createFreshQuotaState(now: Date = new Date()): QuotaState {
  return {
    date: getLocalDateKey(now),
    remaining: DAILY_AI_QUOTA_MAX,
  };
}

export function loadQuotaState(
  storage?: StorageLike | null,
  now: Date = new Date()
): QuotaState {
  const today = getLocalDateKey(now);
  if (!storage) {
    return { date: today, remaining: DAILY_AI_QUOTA_MAX };
  }

  try {
    const raw = storage.getItem(QUOTA_STORAGE_KEY);
    if (!raw) {
      const fresh = { date: today, remaining: DAILY_AI_QUOTA_MAX };
      storage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }

    const parsed = JSON.parse(raw) as Partial<QuotaState>;
    if (parsed.date !== today || typeof parsed.remaining !== 'number' || !Number.isFinite(parsed.remaining)) {
      const reset = { date: today, remaining: DAILY_AI_QUOTA_MAX };
      storage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(reset));
      return reset;
    }

    const clamped = Math.min(DAILY_AI_QUOTA_MAX, Math.max(0, Math.floor(parsed.remaining)));
    return { date: today, remaining: clamped };
  } catch {
    return { date: today, remaining: DAILY_AI_QUOTA_MAX };
  }
}

export function saveQuotaState(
  state: QuotaState,
  storage?: StorageLike | null
): void {
  if (!storage) return;
  try {
    storage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function canSpendQuota(
  state: QuotaState,
  cost: number,
  now: Date = new Date()
): { ok: boolean; error?: string; effectiveState: QuotaState } {
  const today = getLocalDateKey(now);
  const effectiveState =
    state.date === today ? state : { date: today, remaining: DAILY_AI_QUOTA_MAX };

  if (effectiveState.remaining < cost) {
    return {
      ok: false,
      effectiveState,
      error: `Bạn không đủ điểm AI hôm nay (cần ${cost} điểm, hiện còn ${effectiveState.remaining}/${DAILY_AI_QUOTA_MAX}). Điểm sẽ tự động đặt lại vào ngày mai. Các slide hiện tại vẫn được giữ nguyên để bạn chỉnh sửa thủ công, sao chép dàn ý và xuất file bình thường.`,
    };
  }

  return { ok: true, effectiveState };
}

export function spendQuota(
  state: QuotaState,
  cost: number,
  storage?: StorageLike | null,
  now: Date = new Date()
): QuotaState {
  const today = getLocalDateKey(now);
  const baseRemaining =
    state.date === today ? state.remaining : DAILY_AI_QUOTA_MAX;
  const nextState: QuotaState = {
    date: today,
    remaining: Math.max(0, baseRemaining - Math.max(0, cost)),
  };
  saveQuotaState(nextState, storage);
  return nextState;
}
