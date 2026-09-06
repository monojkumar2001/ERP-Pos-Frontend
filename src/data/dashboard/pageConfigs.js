import { flattenNav } from "./nav";

const statusCol = { key: "status", label: "STATUS", type: "status" };
const actionCol = { key: "action", label: "ACTION", type: "action" };

function cols(...labels) {
  return [
    ...labels.map((label) => {
      const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const linkish = /NUMBER|NO\.?$|^NAME$|REFERENCE|CODE|SKU/i.test(label);
      return linkish ? { key, label, type: "link" } : { key, label };
    }),
    statusCol,
    actionCol,
  ];
}

function mockRows(columns, count = 12) {
  return Array.from({ length: count }, (_, i) => {
    const row = { id: i + 1, status: i % 7 === 0 ? "Inactive" : "Active" };
    columns.forEach((c) => {
      if (c.type === "checkbox" || c.type === "action" || c.type === "status") return;
      if (c.key.includes("phone")) row[c.key] = `01${700000000 + i}`;
      else if (c.key.includes("email")) row[c.key] = `user${i + 1}@example.com`;
      else if (c.key.includes("date") || c.key.includes("since"))
        row[c.key] = `2025-0${(i % 9) + 1}-15`;
      else if (c.key.includes("amount") || c.key.includes("total") || c.key.includes("price"))
        row[c.key] = `BDT ${(1000 * (i + 1)).toLocaleString()}`;
      else if (c.key.includes("code")) row[c.key] = `C-${1000 + i}`;
      else row[c.key] = `${c.label.split(" ")[0]} ${i + 1}`;
    });
    return row;
  });
}

/** Route-specific overrides for columns / filters / type */
const OVERRIDES = {
  "/en/sales/customers": {
    title: "Customers",
    module: "Sales",
    addLabel: "Add Customer",
    addHref: "/en/sales/customer-create",
    filters: [
      { key: "type", label: "Customer Types", placeholder: "ex: VIP, Retailer" },
      { key: "status", label: "Status", placeholder: "Select status" },
      { key: "alsoSupplier", label: "Also Supplier", placeholder: "Yes / No" },
    ],
    columns: [
      { key: "_check", label: "", type: "checkbox" },
      { key: "name", label: "NAME", type: "link" },
      { key: "phone_number", label: "PHONE NUMBER" },
      { key: "email", label: "EMAIL" },
      { key: "customer_since", label: "CUSTOMER SINCE" },
      { key: "customer_code", label: "CUSTOMER CODE" },
      { key: "customer_type", label: "CUSTOMER TYPE" },
      statusCol,
      actionCol,
    ],
    totalEntries: 3371,
  },
  "/en/sales/customer-types": {
    title: "Customer Types",
    module: "Sales",
    addLabel: "Add Customer Type",
    columns: cols("NAME", "DESCRIPTION", "CUSTOMERS"),
  },
  "/en/accounting/accounts": {
    type: "special",
    special: "chart-of-accounts",
    title: "Chart Of Accounts",
    module: "Accounting",
  },
  "/en/accounting/journals": {
    title: "Journals",
    module: "Accounting",
    apiEndpoint: "/accounting/journals",
    addLabel: "Add Journal",
    hideFilterToggle: true,
    filters: [
      {
        key: "status",
        label: "Status",
        type: "multiselect",
        placeholder: "Status",
        options: ["Approved", "Draft"],
        defaultValue: ["Approved", "Draft"],
      },
      {
        key: "range",
        label: "Select Range",
        placeholder: "Select Range",
        options: [
          "Today",
          "Yesterday",
          "This Week",
          "Last Week",
          "This Month",
          "Last Month",
          "This Year",
          "Last Year",
          "Custom",
        ],
      },
      { key: "from", label: "From Date", type: "date", placeholder: "From Date" },
      { key: "to", label: "To Date", type: "date", placeholder: "To Date" },
    ],
    columns: [
      { key: "reference_number", label: "REFERENCE NUMBER", type: "link" },
      { key: "date", label: "DATE" },
      { key: "time", label: "TIME" },
      { key: "description", label: "DESCRIPTION" },
      { key: "amount", label: "AMOUNT" },
      statusCol,
      actionCol,
    ],
    totalEntries: 141,
    totalAmount: "৳ 4,497,498",
  },
  "/en/accounting/expenses": {
    title: "Expenses",
    module: "Accounting",
    apiEndpoint: "/accounting/expenses",
    addLabel: "Add Expense",
    hideFilterToggle: true,
    filters: [
      { key: "expense_from", label: "Select Expense From", placeholder: "Select Expense From" },
      { key: "expense_to", label: "Select Expense To", placeholder: "Select Expense To" },
      {
        key: "status",
        label: "Status",
        type: "multiselect",
        placeholder: "Status",
        options: ["Approved", "Draft"],
        defaultValue: ["Approved", "Draft"],
      },
      {
        key: "range",
        label: "Select Range",
        placeholder: "Select Range",
        options: [
          "Today",
          "Yesterday",
          "This Week",
          "Last Week",
          "This Month",
          "Last Month",
          "This Year",
          "Last Year",
          "Custom",
        ],
      },
      { key: "from", label: "From Date", type: "date", placeholder: "From Date" },
      { key: "to", label: "To Date", type: "date", placeholder: "To Date" },
    ],
    columns: [
      { key: "reference_number", label: "REFERENCE NUMBER", type: "link" },
      { key: "date", label: "DATE" },
      { key: "time", label: "TIME" },
      { key: "description", label: "DESCRIPTION" },
      { key: "expense_from", label: "EXPENSE FROM" },
      { key: "amount", label: "AMOUNT" },
      statusCol,
      actionCol,
    ],
    totalEntries: 179,
    totalAmount: "৳ 125,991",
  },
  "/en/accounting/incomes": {
    title: "Incomes",
    module: "Accounting",
    apiEndpoint: "/accounting/incomes",
    addLabel: "Add Income",
    hideFilterToggle: true,
    filters: [
      { key: "income_to", label: "Select Income To", placeholder: "Select Income To" },
      { key: "income_from", label: "Select Income From", placeholder: "Select Income From" },
      {
        key: "status",
        label: "Status",
        type: "multiselect",
        placeholder: "Status",
        options: ["Approved", "Draft"],
        defaultValue: ["Approved", "Draft"],
      },
      {
        key: "range",
        label: "Select Range",
        placeholder: "Select Range",
        options: [
          "Today",
          "Yesterday",
          "This Week",
          "Last Week",
          "This Month",
          "Last Month",
          "This Year",
          "Last Year",
          "Custom",
        ],
      },
      { key: "from", label: "From Date", type: "date", placeholder: "From Date" },
      { key: "to", label: "To Date", type: "date", placeholder: "To Date" },
    ],
    columns: [
      { key: "reference_number", label: "REFERENCE NUMBER", type: "link" },
      { key: "date", label: "DATE" },
      { key: "time", label: "TIME" },
      { key: "description", label: "DESCRIPTION" },
      { key: "income_to", label: "INCOME TO" },
      { key: "amount", label: "AMOUNT" },
      statusCol,
      actionCol,
    ],
    totalEntries: 40,
    totalAmount: "৳ 654,055",
  },
  "/en/item-config/items": {
    title: "Items",
    module: "Item",
    addLabel: "Add Item",
    columns: cols("SKU", "NAME", "CATEGORY", "PRICE", "STOCK"),
  },
  "/en/item-config/item-categories": {
    title: "Category",
    module: "Item",
    addLabel: "Add Category",
    columns: cols("NAME", "PARENT", "ITEMS"),
  },
  "/en/purchase/suppliers": {
    title: "Suppliers",
    module: "Purchase",
    addLabel: "Add Supplier",
    columns: cols("NAME", "PHONE NUMBER", "EMAIL", "SUPPLIER TYPE"),
  },
  "/en/hrm/employee/employees": {
    title: "Employees",
    module: "HRM",
    addLabel: "Add Employee",
    columns: cols("EMPLOYEE ID", "NAME", "DEPARTMENT", "JOB TITLE", "PHONE NUMBER"),
  },
  "/en/sales/sales-invoices": {
    title: "All Invoices",
    module: "Sales",
    addLabel: "Create Invoice",
    columns: cols("INVOICE NO", "CUSTOMER", "DATE", "TOTAL", "DUE"),
  },
  "/en/sales/quotation-list": {
    title: "Quotation",
    module: "Sales",
    addLabel: "Create Quotation",
    addHref: "/en/sales/quotation-create",
    columns: cols("QUOTATION NO", "CUSTOMER", "DATE", "TOTAL"),
  },
  "/en/pos/outlets": {
    title: "Outlet",
    module: "POS",
    addLabel: "Add Outlet",
    columns: cols("NAME", "CODE", "ADDRESS", "WAREHOUSE"),
  },
  "/en/reports/index": { type: "special", special: "reports", title: "Reports", module: "Reports" },
  "/en/manufacturing/dashboard": {
    type: "special",
    special: "manufacturing",
    title: "Manufacturing Overview",
    module: "Manufacturing",
  },
  "/en/hrm/attendance/attendance-sheet": {
    type: "special",
    special: "attendance",
    title: "Take Attendance",
    module: "HRM",
  },
  "/en/pos/barcodegeneration": {
    type: "special",
    special: "barcode",
    title: "Barcode",
    module: "POS",
  },
  "/en/accounting/dashboard": {
    type: "special",
    special: "accounting-dash",
    title: "Accounting Dashboard",
    module: "Accounting",
  },
};

const FORM_ROUTES = {
  "/en/sales/customer-create": {
    type: "form",
    title: "Create Customer",
    module: "Sales",
    fields: [
      { key: "name", label: "Full name", required: true },
      { key: "phone", label: "Phone number", required: true },
      { key: "email", label: "Email" },
      { key: "type", label: "Customer type", type: "select", options: ["Retail", "VIP", "Wholesale"] },
      { key: "address", label: "Address", type: "textarea" },
    ],
  },
  "/en/sales/quotation-create": {
    type: "form",
    title: "Create Quotation",
    module: "Sales",
    fields: [
      { key: "customer", label: "Customer", required: true },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  "/en/sales/sales-direct-sale-create": {
    type: "form",
    title: "Direct Invoice",
    module: "Sales",
    fields: [
      { key: "customer", label: "Customer", required: true },
      { key: "date", label: "Invoice date", type: "date", required: true },
      { key: "warehouse", label: "Warehouse", type: "select", options: ["Main", "Store 2"] },
    ],
  },
  "/en/purchase/requisition-create": {
    type: "form",
    title: "Create Requisition",
    module: "Purchase",
    fields: [
      { key: "supplier", label: "Supplier" },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  "/en/purchase/direct-purchase-create": {
    type: "form",
    title: "Direct Bill",
    module: "Purchase",
    fields: [
      { key: "supplier", label: "Supplier", required: true },
      { key: "date", label: "Bill date", type: "date", required: true },
      { key: "warehouse", label: "Warehouse", type: "select", options: ["Main", "Store 2"] },
    ],
  },
  "/en/cms/orders": {
    type: "list",
    title: "Online Orders",
    module: "CMS",
    columns: cols("ORDER NO", "CUSTOMER", "DATE", "TOTAL", "CHANNEL"),
    rows: mockRows(cols("ORDER NO", "CUSTOMER", "DATE", "TOTAL", "CHANNEL"), 15),
  },
};

function defaultListConfig(href, label) {
  const parts = href.split("/").filter(Boolean);
  const module = parts[1] ? parts[1].replace(/-/g, " ") : "App";
  const isTxn = /sales|purchase|accounting|pos|inventory/i.test(href);
  return {
    type: "list",
    title: label,
    module: module.charAt(0).toUpperCase() + module.slice(1),
    addLabel: `Add ${label}`,
    hideFilterToggle: true,
    columns: cols("NAME", "CODE", "CREATED", "UPDATED"),
    filters: isTxn
      ? [
          {
            key: "status",
            label: "Status",
            type: "multiselect",
            placeholder: "Status",
            options: ["Approved", "Draft"],
            defaultValue: ["Approved", "Draft"],
          },
          {
            key: "range",
            label: "Select Range",
            placeholder: "Select Range",
            options: [
              "Today",
              "Yesterday",
              "This Week",
              "Last Week",
              "This Month",
              "Last Month",
              "This Year",
              "Last Year",
              "Custom",
            ],
          },
          { key: "from", label: "From Date", type: "date", placeholder: "From Date" },
          { key: "to", label: "To Date", type: "date", placeholder: "To Date" },
        ]
      : [{ key: "status", label: "Status", placeholder: "Select status" }],
    totalEntries: 48,
  };
}

function buildPageConfigs() {
  const map = { ...FORM_ROUTES };

  for (const node of flattenNav()) {
    if (!node.href || node.href === "/en/dashboard") continue;
    if (map[node.href]) continue;
    if (OVERRIDES[node.href]) {
      const o = OVERRIDES[node.href];
      if (o.type === "special") {
        map[node.href] = o;
      } else {
        map[node.href] = {
          type: "list",
          ...o,
          rows: mockRows(o.columns || cols("NAME"), 15),
        };
      }
      continue;
    }
    const base = defaultListConfig(node.href, node.label);
    map[node.href] = { ...base, rows: mockRows(base.columns) };
  }

  // Apply overrides that weren't in nav leaves (forms already added)
  for (const [href, o] of Object.entries(OVERRIDES)) {
    if (map[href]?.type === "list" && o.columns) continue;
    if (!map[href]) {
      if (o.type === "special") map[href] = o;
      else map[href] = { type: "list", ...o, rows: mockRows(o.columns || cols("NAME"), 15) };
    }
  }

  // Ensure customer rows look realistic
  if (map["/en/sales/customers"]) {
    const c = map["/en/sales/customers"];
    c.rows = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: [
        "MD IMRAN Hossain",
        "Ekramul Hoque",
        "Nabil Rahman",
        "Ariful Islam",
        "Mainul Islam",
        "Fatema Akter",
        "Karim Traders",
        "Bestu Store",
      ][i % 8],
      phone_number: `0171${String(1000000 + i).slice(0, 7)}`,
      email: `customer${i + 1}@mail.com`,
      customer_since: `2024-${String((i % 12) + 1).padStart(2, "0")}-10`,
      customer_code: `CUS-${2000 + i}`,
      customer_type: ["Retail", "VIP", "Wholesale"][i % 3],
      status: i % 9 === 0 ? "Inactive" : "Active",
    }));
  }

  if (map["/en/accounting/journals"]) {
    const samples = [
      { reference_number: "JV-2026-00000031", date: "1 Sep 2026", time: "02:53 PM", description: "Test", amount: "৳ 59", status: "Approved" },
      { reference_number: "JV-2026-00000032", date: "1 Sep 2026", time: "02:53 PM", description: "testing", amount: "৳ 130", status: "Approved" },
      { reference_number: "JV-2026-00000030", date: "12 Aug 2026", time: "03:03 PM", description: "dokan rent", amount: "৳ 10,000", status: "Approved" },
      { reference_number: "JV-2026-00000029", date: "6 Aug 2026", time: "03:06 PM", description: "agdyqfdyqfdyq", amount: "৳ 70,000", status: "Approved" },
      { reference_number: "N/A", date: "28 Jul 2026", time: "06:37 PM", description: "Test", amount: "৳ 50", status: "Draft" },
      { reference_number: "JV-2026-00000028", date: "28 Jul 2026", time: "06:37 PM", description: "Test", amount: "৳ 50", status: "Approved" },
      { reference_number: "N/A", date: "15 Jul 2026", time: "04:22 PM", description: "test", amount: "৳ 159", status: "Draft" },
      { reference_number: "JV-2026-00000026", date: "13 Jul 2026", time: "12:51 PM", description: "corporate sale", amount: "৳ 8,000", status: "Approved" },
      { reference_number: "JV-2026-00000025", date: "6 Jul 2026", time: "01:23 PM", description: "Salary Disbursment Account to Account = 1000 EFTN …", amount: "৳ 2,000", status: "Approved" },
      { reference_number: "JV-2026-00000024", date: "5 Jul 2026", time: "05:01 PM", description: "regular", amount: "৳ 5,000", status: "Approved" },
      { reference_number: "JV-2026-00000022", date: "21 Jun 2026", time: "05:01 PM", description: "Cash paid to M\\S Corporation for battery purpose", amount: "৳ 50,000", status: "Approved" },
      { reference_number: "JV-2026-00000021", date: "21 Jun 2026", time: "02:49 PM", description: "paid by city bank for store furnichare 4*15000=600…", amount: "৳ 60,000", status: "Approved" },
      { reference_number: "JV-2026-00000020", date: "21 Jun 2026", time: "02:12 PM", description: "paid cash for seeing machine ( to Rahim, 50000*4=2…", amount: "৳ 2,000,000", status: "Approved" },
      { reference_number: "JV-2026-00000023", date: "1 Jun 2026", time: "04:29 PM", description: "disve", amount: "৳ 100,000", status: "Approved" },
      { reference_number: "JV-2026-00000019", date: "17 May 2026", time: "12:34 PM", description: "Cash bank transfer", amount: "৳ 20,000", status: "Approved" },
      { reference_number: "JV-2026-00000018", date: "9 May 2026", time: "07:20 AM", description: "gdfgdfhds", amount: "৳ 500,000", status: "Approved" },
      { reference_number: "JV-2026-00000017", date: "3 May 2026", time: "04:00 PM", description: "investment", amount: "৳ 50,000", status: "Approved" },
      { reference_number: "JV-2026-00000016", date: "21 Apr 2026", time: "12:38 AM", description: "dhfdhfdhdfh", amount: "৳ 200", status: "Approved" },
      { reference_number: "JV-2026-00000015", date: "19 Apr 2026", time: "04:53 PM", description: "Land purchase by cash", amount: "৳ 1,500,000", status: "Approved" },
      { reference_number: "JV-2026-00000014", date: "15 Apr 2026", time: "11:26 AM", description: "Application fee provid by cash", amount: "৳ 150", status: "Approved" },
      { reference_number: "JV-2026-00000013", date: "8 Mar 2026", time: "11:34 AM", description: "Investment", amount: "৳ 5,000", status: "Approved" },
      { reference_number: "JV-2026-00000011", date: "8 Feb 2026", time: "04:51 PM", description: "Shift", amount: "৳ 1,000", status: "Approved" },
      { reference_number: "JV-2026-00000010", date: "25 Jan 2026", time: "11:42 AM", description: "Labor cost paid", amount: "৳ 15,000", status: "Approved" },
      { reference_number: "JV-2026-00000009", date: "12 Jan 2026", time: "07:15 PM", description: "dsada", amount: "৳ 100,000", status: "Approved" },
      { reference_number: "JV-2026-00000008", date: "12 Jan 2026", time: "07:14 PM", description: "sada", amount: "৳ 700", status: "Approved" },
    ];
    map["/en/accounting/journals"].rows = [
      ...samples.map((row, i) => ({ id: i + 1, ...row })),
      ...Array.from({ length: 116 }, (_, i) => ({
        id: samples.length + i + 1,
        reference_number: `JV-2025-${String(Math.max(1, 40 - i)).padStart(8, "0")}`,
        date: `${(i % 28) + 1} Dec 2025`,
        time: `${String(9 + (i % 10)).padStart(2, "0")}:${String((i * 3) % 60).padStart(2, "0")} ${i % 2 ? "PM" : "AM"}`,
        description: ["Opening balance", "Adjustment", "Transfer", "Misc entry"][i % 4],
        amount: `৳ ${(100 + i * 250).toLocaleString()}`,
        status: i % 11 === 0 ? "Draft" : "Approved",
      })),
    ];
  }

  if (map["/en/accounting/expenses"]) {
    map["/en/accounting/expenses"].rows = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      reference_number: i === 4 ? "N/A" : `DV-2026-${String(44 - i).padStart(8, "0")}`,
      date: `${(i % 28) + 1} Aug 2026`,
      time: `${String(10 + (i % 8)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")} PM`,
      description: ["testing", "Test", "Office expense", "Transport", "Utilities"][i % 5],
      expense_from: ["Bank Asia", "ADDD", "Cash on Hand", "City Bank", "DBBL Bank"][i % 5],
      amount: `৳ ${(50 + i * 80).toLocaleString()}`,
      status: i % 6 === 0 ? "Draft" : "Approved",
    }));
  }

  if (map["/en/accounting/incomes"]) {
    map["/en/accounting/incomes"].rows = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      reference_number: `CV-2026-${String(14 - (i % 14)).padStart(8, "0")}`,
      date: `${(i % 28) + 1} Aug 2026`,
      time: `${String(9 + (i % 10)).padStart(2, "0")}:${String((i * 5) % 60).padStart(2, "0")} AM`,
      description: ["testing", "df", "Sale income", "Service", "Other"][i % 5],
      income_to: ["Brack Bank", "Cash on Handss", "City Bank", "IBBL", "Petty Cash"][i % 5],
      amount: `৳ ${(5 + i * 120).toLocaleString()}`,
      status: i % 7 === 0 ? "Draft" : "Approved",
    }));
  }

  // Merge any generated live overrides (from applyLiveSchemas.mjs)
  try {
    // eslint-disable-next-line import/no-unresolved, global-require
    const liveBundle = require("./liveOverrides.generated.json");
    const live = liveBundle.overrides || liveBundle;
    const liveRows = liveBundle.rows || {};
    for (const [href, o] of Object.entries(live)) {
      if (!o || typeof o !== "object" || !o.columns) continue;
      if (map[href]?.type === "special" || map[href]?.type === "form") continue;
      map[href] = {
        type: "list",
        module: map[href]?.module || "App",
        ...map[href],
        ...o,
        addLabel: Object.prototype.hasOwnProperty.call(o, "addLabel")
          ? o.addLabel
          : map[href]?.addLabel,
        rows: liveRows[href] || map[href]?.rows || mockRows(o.columns, 15),
      };
    }
  } catch (_) {
    /* generated file optional until scrape completes */
  }

  // Accounting list pages load from API (company-scoped)
  const accountingApis = {
    "/en/accounting/journals": "/accounting/journals",
    "/en/accounting/expenses": "/accounting/expenses",
    "/en/accounting/incomes": "/accounting/incomes",
    "/en/accounting/transfer-money": "/accounting/transfers",
    "/en/accounting/recurring-journal": "/accounting/recurring-journals",
  };
  for (const [href, endpoint] of Object.entries(accountingApis)) {
    if (map[href]) {
      map[href].apiEndpoint = endpoint;
      map[href].module = "Accounting";
      // Prefer live API rows over static mock
      map[href].rows = [];
    }
  }

  return map;
}

export const PAGE_CONFIGS = buildPageConfigs();

export function getPageConfig(pathname) {
  return PAGE_CONFIGS[pathname] || null;
}

export function allPagePaths() {
  return Object.keys(PAGE_CONFIGS);
}
