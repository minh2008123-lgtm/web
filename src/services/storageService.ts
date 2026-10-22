const STORAGE_KEY = 'linguaquest_phase2_state_v1';

export function loadPersistedState<T>(fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function savePersistedState<T>(state: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Bỏ qua lỗi nếu trình duyệt chặn localStorage trong iframe
  }
}

export function clearPersistedState(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
