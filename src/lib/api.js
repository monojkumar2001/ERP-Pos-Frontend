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

function accountingResource(base, extras = {}) {
  const path = `/accounting/${base}`;
  return {
    list: () => api(path),
    get: (id) => api(`${path}/${id}`),
    create: (body) => api(path, { method: "POST", body }),
    update: (id, body) => api(`${path}/${id}`, { method: "PUT", body }),
    delete: (id) => api(`${path}/${id}`, { method: "DELETE" }),
    setStatus: (id, status) =>
      api(`${path}/${id}/status`, { method: "PATCH", body: { status } }),
    ...extras,
  };
}

export const accountingApi = {
  dashboard: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/accounting/dashboard${q ? `?${q}` : ""}`);
  },
  accounts: () => api("/accounting/accounts"),
  createAccount: (body) => api("/accounting/accounts", { method: "POST", body }),
  getAccount: (id) => api(`/accounting/accounts/${id}`),
  updateAccount: (id, body) => api(`/accounting/accounts/${id}`, { method: "PUT", body }),
  deleteAccount: (id) => api(`/accounting/accounts/${id}`, { method: "DELETE" }),
  reorderAccounts: (body) => api("/accounting/accounts/reorder", { method: "POST", body }),
  journals: () => api("/accounting/journals"),
  journal: accountingResource("journals", {
    approve: (id) => api(`/accounting/journals/${id}/approve`, { method: "PATCH" }),
  }),
  expenses: () => api("/accounting/expenses"),
  expense: accountingResource("expenses"),
  incomes: () => api("/accounting/incomes"),
  income: accountingResource("incomes"),
  transfers: () => api("/accounting/transfers"),
  transfer: accountingResource("transfers"),
  recurringJournals: () => api("/accounting/recurring-journals"),
  recurringJournal: accountingResource("recurring-journals", {
    run: (id) => api(`/accounting/recurring-journals/${id}/run`, { method: "POST" }),
  }),
};

export const dashboardApi = {
  home: () => api("/dashboard"),
};

export const subscriptionApi = {
  list: () => api("/subscriptions"),
};

export const aclApi = {
  roles: () => api("/acl/roles"),
  createRole: (body) => api("/acl/roles", { method: "POST", body }),
  role: (id) => api(`/acl/roles/${id}`),
  updateRole: (id, body) => api(`/acl/roles/${id}`, { method: "PUT", body }),
  deleteRole: (id) => api(`/acl/roles/${id}`, { method: "DELETE" }),
  cloneRole: (id) => api(`/acl/roles/${id}/clone`, { method: "POST" }),
  inviteUserToRole: (id, body) =>
    api(`/acl/roles/${id}/invite-user`, { method: "POST", body }),
  permissions: () => api("/acl/permissions"),
  users: () => api("/acl/users"),
  inviteUser: (body) => api("/acl/users/invite", { method: "POST", body }),
  user: (id) => api(`/acl/users/${id}`),
  updateUserStatus: (id, status) =>
    api(`/acl/users/${id}/status`, { method: "PATCH", body: { status } }),
  assignRole: (id, role_id) =>
    api(`/acl/users/${id}/roles`, { method: "POST", body: { role_id } }),
};

function masterResource(base, extras = {}) {
  const path = `/master/${base}`;
  return {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api(`${path}${q ? `?${q}` : ""}`);
    },
    get: (id) => api(`${path}/${id}`),
    create: (body) => api(path, { method: "POST", body }),
    update: (id, body) => api(`${path}/${id}`, { method: "PUT", body }),
    delete: (id) => api(`${path}/${id}`, { method: "DELETE" }),
    updateStatus: (id, status) =>
      api(`${path}/${id}/status`, { method: "PATCH", body: { status } }),
    ...extras,
  };
}

export const masterApi = {
  itemCategories: masterResource("item-categories"),
  manufacturers: masterResource("manufacturers", {
    updateDiscount: (id, discount) =>
      api(`/master/manufacturers/${id}/discount`, { method: "PATCH", body: { discount } }),
  }),
  brands: masterResource("brands", {
    updateDiscount: (id, discount) =>
      api(`/master/brands/${id}/discount`, { method: "PATCH", body: { discount } }),
  }),
  colors: masterResource("colors"),
  sizeTypes: masterResource("size-types"),
  attributeSets: masterResource("attribute-sets"),
  priceLists: masterResource("price-lists", {
    deactivate: (id) => api(`/master/price-lists/${id}/deactivate`, { method: "PATCH" }),
  }),
  uomConversions: masterResource("uom-conversions"),
  items: masterResource("items", {
    updateOpeningStock: (id, body) =>
      api(`/master/items/${id}/opening-stock`, { method: "PATCH", body }),
  }),
  customerTypes: masterResource("customer-types"),
  customers: masterResource("customers"),
  supplierTypes: masterResource("supplier-types"),
  suppliers: masterResource("suppliers"),
  warehouses: masterResource("warehouses"),
  binLocations: masterResource("bin-locations"),
  outlets: masterResource("outlets"),
};

function settingsResource(base, extras = {}) {
  const path = `/settings/${base}`;
  return {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api(`${path}${q ? `?${q}` : ""}`);
    },
    get: (id) => api(`${path}/${id}`),
    create: (body) => api(path, { method: "POST", body }),
    update: (id, body) => api(`${path}/${id}`, { method: "PUT", body }),
    delete: (id) => api(`${path}/${id}`, { method: "DELETE" }),
    updateStatus: (id, status) =>
      api(`${path}/${id}/status`, { method: "PATCH", body: { status } }),
    ...extras,
  };
}

function inventoryResource(base, extras = {}) {
  const path = `/inventory/${base}`;
  return {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api(`${path}${q ? `?${q}` : ""}`);
    },
    get: (id) => api(`${path}/${id}`),
    create: (body) => api(path, { method: "POST", body }),
    update: (id, body) => api(`${path}/${id}`, { method: "PUT", body }),
    delete: (id) => api(`${path}/${id}`, { method: "DELETE" }),
    setStatus: (id, status) =>
      api(`${path}/${id}/status`, { method: "PATCH", body: { status } }),
    cancel: (id) => api(`${path}/${id}/cancel`, { method: "PATCH" }),
    ...extras,
  };
}

export const inventoryApi = {
  itemStock: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/inventory/item-stock${q ? `?${q}` : ""}`);
  },
  stockAdjustment: inventoryResource("stock-adjustments"),
  warehouseTransfer: inventoryResource("warehouse-transfers", {
    request: (body) =>
      api("/inventory/warehouse-transfers/request", { method: "POST", body }),
    initiate: (id) =>
      api(`/inventory/warehouse-transfers/${id}/initiate`, { method: "POST" }),
    receive: (id, body) =>
      api(`/inventory/warehouse-transfers/${id}/receive`, { method: "POST", body }),
  }),
  receivableStock: () => api("/inventory/receivable-stock"),
  warehouseAccess: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api(`/inventory/warehouse-access${q ? `?${q}` : ""}`);
    },
    create: (body) => api("/inventory/warehouse-access", { method: "POST", body }),
    delete: (id) => api(`/inventory/warehouse-access/${id}`, { method: "DELETE" }),
  },
};

function salesResource(base, extras = {}) {
  const path = `/sales/${base}`;
  return {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api(`${path}${q ? `?${q}` : ""}`);
    },
    get: (id) => api(`${path}/${id}`),
    create: (body) => api(path, { method: "POST", body }),
    update: (id, body) => api(`${path}/${id}`, { method: "PUT", body }),
    delete: (id) => api(`${path}/${id}`, { method: "DELETE" }),
    setStatus: (id, status) =>
      api(`${path}/${id}/status`, { method: "PATCH", body: { status } }),
    cancel: (id) => api(`${path}/${id}/cancel`, { method: "PATCH" }),
    ...extras,
  };
}

export const salesApi = {
  directInvoices: salesResource("direct-invoices"),
  quotations: salesResource("quotations", {
    convertToOrder: (id) =>
      api(`/sales/quotations/${id}/convert-to-order`, { method: "POST" }),
  }),
  orders: salesResource("orders", {
    convertToDelivery: (id) =>
      api(`/sales/orders/${id}/convert-to-delivery`, { method: "POST" }),
    convertToInvoice: (id) =>
      api(`/sales/orders/${id}/convert-to-invoice`, { method: "POST" }),
  }),
  deliveries: salesResource("deliveries"),
  invoices: salesResource("invoices"),
  returns: salesResource("returns"),
  batchPayments: salesResource("batch-payments"),
  payments: salesResource("payments"),
  customerDebits: salesResource("customer-debits"),
  refunds: salesResource("refunds"),
};

function purchaseResource(base, extras = {}) {
  const path = `/purchase/${base}`;
  return {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api(`${path}${q ? `?${q}` : ""}`);
    },
    get: (id) => api(`${path}/${id}`),
    create: (body) => api(path, { method: "POST", body }),
    update: (id, body) => api(`${path}/${id}`, { method: "PUT", body }),
    delete: (id) => api(`${path}/${id}`, { method: "DELETE" }),
    setStatus: (id, status) =>
      api(`${path}/${id}/status`, { method: "PATCH", body: { status } }),
    cancel: (id) => api(`${path}/${id}/cancel`, { method: "PATCH" }),
    ...extras,
  };
}

export const purchaseApi = {
  directBills: purchaseResource("direct-bills"),
  requisitions: purchaseResource("requisitions", {
    convertToOrder: (id) =>
      api(`/purchase/requisitions/${id}/convert-to-order`, { method: "POST" }),
  }),
  orders: purchaseResource("orders", {
    convertToReceipt: (id) =>
      api(`/purchase/orders/${id}/convert-to-receipt`, { method: "POST" }),
    convertToBill: (id) =>
      api(`/purchase/orders/${id}/convert-to-bill`, { method: "POST" }),
  }),
  receipts: purchaseResource("receipts"),
  bills: purchaseResource("bills"),
  returns: purchaseResource("returns"),
  batchPayments: purchaseResource("batch-payments"),
  payments: purchaseResource("payments"),
  supplierCredits: purchaseResource("supplier-credits"),
  refunds: purchaseResource("refunds"),
};

export const settingsApi = {
  company: {
    get: async () => unwrapApiData(await api("/settings/company")),
    update: (body) => api("/settings/company", { method: "PUT", body }),
  },
  taxes: settingsResource("taxes"),
  discounts: settingsResource("discounts", {
    updateEffectiveDate: (id, body) =>
      api(`/settings/discounts/${id}/effective-date`, { method: "PATCH", body }),
  }),
  paymentMethods: settingsResource("payment-methods"),
  deliveryChannels: settingsResource("delivery-channels"),
  deliveryCharges: settingsResource("delivery-charges", {
    generate: () => api("/settings/delivery-charges/generate", { method: "POST" }),
  }),
  adjustmentReasons: settingsResource("adjustment-reasons"),
  customFields: settingsResource("custom-fields"),
  emailTemplates: settingsResource("email-templates"),
  smsTemplates: settingsResource("sms-templates"),
};

/** Unwrap `{ data }` envelope from ApiResponse helpers. */
export function unwrapApiData(res) {
  return res?.data ?? res;
}

