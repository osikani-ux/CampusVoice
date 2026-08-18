import type { User } from "../data";

interface StoredAccount extends User {
  password: string;
  joinedAt: string;
}

const ACCOUNTS_KEY = "cv_accounts_v1";
const SESSION_KEY = "cv_session_v1";

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(list: StoredAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — session-only mode */
  }
}

export const publicInfo = (a: StoredAccount): User => ({
  name: a.name,
  email: a.email,
  school: a.school,
  level: a.level,
  course: a.course,
  verified: a.verified,
});

/** All saved accounts (public fields only). */
export function getAccounts(): User[] {
  return readAccounts().map(publicInfo);
}

/** Create a new account. Returns an error string or null on success. */
export function signup(
  data: { name: string; email: string; school: string; level: string; course: string; password: string },
  verified: boolean
): { error?: string; user?: User } {
  const email = data.email.trim().toLowerCase();
  const list = readAccounts();
  if (list.some((a) => a.email === email)) {
    return { error: "An account with this email already exists — try logging in instead." };
  }
  const account: StoredAccount = {
    name: data.name.trim(),
    email,
    school: data.school,
    level: data.level,
    course: data.course.trim(),
    password: data.password,
    verified,
    joinedAt: new Date().toISOString(),
  };
  writeAccounts([...list, account]);
  setSession(email);
  return { user: publicInfo(account) };
}

/** Log in with email + password. */
export function login(emailRaw: string, password: string): { error?: string; user?: User } {
  const email = emailRaw.trim().toLowerCase();
  const account = readAccounts().find((a) => a.email === email);
  if (!account) return { error: "No CampusVoice account found for this email. Create one below." };
  if (account.password !== password) return { error: "Incorrect password — try again or create a new account." };
  setSession(email);
  return { user: publicInfo(account) };
}

export function setSession(email: string): void {
  try {
    localStorage.setItem(SESSION_KEY, email);
  } catch {
    /* ignore */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** Restore the session on load, if any. */
export function getSession(): User | null {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const account = readAccounts().find((a) => a.email === email);
    return account ? publicInfo(account) : null;
  } catch {
    return null;
  }
}

/** Mark the current account as a verified student. */
export function markVerified(email: string): void {
  const list = readAccounts();
  writeAccounts(list.map((a) => (a.email === email.toLowerCase() ? { ...a, verified: true } : a)));
}
