export const MANAGER_SESSION_KEY = "fm-manager-session";

export function isManagerLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(MANAGER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setManagerSession(active: boolean) {
  if (typeof window === "undefined") return;
  if (active) localStorage.setItem(MANAGER_SESSION_KEY, "1");
  else localStorage.removeItem(MANAGER_SESSION_KEY);
  window.dispatchEvent(new CustomEvent("fm-manager-auth"));
}

/** Demo login; override with NEXT_PUBLIC_MANAGER_PASSWORD in .env.local */
export function getExpectedManagerPassword(): string {
  return process.env.NEXT_PUBLIC_MANAGER_PASSWORD?.trim() || "market";
}
