const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function api(path, { method = "GET", body, token, headers } = {}) {
  const authToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("erp_token") : null);

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(" ") : null) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data;
}

export const authApi = {
  register: (payload) => api("/register", { method: "POST", body: payload }),
  login: (payload) => api("/login", { method: "POST", body: payload }),
  verify: (payload) => api("/auth/verify", { method: "POST", body: payload }),
  resendVerification: (payload) =>
    api("/auth/resend-verification", { method: "POST", body: payload }),
  forgotPassword: (payload) =>
    api("/auth/forgot-password", { method: "POST", body: payload }),
  resetPassword: (payload) =>
    api("/auth/reset-password", { method: "POST", body: payload }),
  me: () => api("/me"),
  logout: () => api("/logout", { method: "POST" }),
};

export const accountingApi = {
  dashboard: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/accounting/dashboard${q ? `?${q}` : ""}`);
  },
  accounts: () => api("/accounting/accounts"),
  journals: () => api("/accounting/journals"),
  expenses: () => api("/accounting/expenses"),
  incomes: () => api("/accounting/incomes"),
  transfers: () => api("/accounting/transfers"),
  recurringJournals: () => api("/accounting/recurring-journals"),
};

