import { User, UserStats } from '../types';

const STORAGE_KEY = 'linguaquest_app_state_v2';
const ACCOUNTS_KEY = 'linguaquest_registered_accounts_v2';

export interface StoredAccount {
  user: User;
  password?: string;
  stats: UserStats;
}

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
    // Bỏ qua lỗi nếu trình duyệt chặn localStorage
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

export function getStoredAccounts(): StoredAccount[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredAccount(account: StoredAccount): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const accounts = getStoredAccounts();
    const index = accounts.findIndex(
      (a) => a.user.email.toLowerCase() === account.user.email.toLowerCase()
    );
    if (index >= 0) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

export function findStoredAccount(email: string): StoredAccount | undefined {
  const accounts = getStoredAccounts();
  return accounts.find(
    (a) => a.user.email.toLowerCase() === email.trim().toLowerCase()
  );
}
