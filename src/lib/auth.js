const TOKEN_KEY = "erp_token";
const USER_KEY = "erp_user";
const COMPANY_KEY = "erp_company";

export function saveSession({ token, user, company }) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (company) localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(COMPANY_KEY);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function getCompany() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(COMPANY_KEY) || "null");
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}
