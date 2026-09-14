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
    addLabel: "Add",
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
    type: "special",
    special: "items",
    title: "Items",
    module: "Item",
  },
  "/en/item-config/item-categories": {
    type: "special",
    special: "item-categories",
    title: "All Categories",
    module: "Item",
  },
  "/en/item-config/price-list": {
    title: "Price List",
    module: "Item",
    addLabel: "Add Price List",
    addHref: "/en/item-config/price-list-create",
    columns: cols("NAME", "TRANSACTION TYPE", "PRICEBOOK TYPE"),
  },
  "/en/purchase/suppliers": {
    title: "Suppliers",
    module: "Purchase",
    addLabel: "Add Supplier",
    addHref: "/en/purchase/supplier-create",
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
    addLabel: "",
    columns: cols("INVOICE NO", "CUSTOMER", "DATE", "TOTAL", "DUE"),
  },
  "/en/sales/quotation-list": {
    title: "Quotation",
    module: "Sales",
    addLabel: "Add Quotation",
    addHref: "/en/sales/quotation-create",
    columns: cols("QUOTATION NO", "CUSTOMER", "DATE", "TOTAL"),
  },
  "/en/sales/sales-orders": {
    title: "Sales Orders",
    module: "Sales",
    addLabel: "Add Order",
    addHref: "/en/sales/sales-order-create",
    columns: cols("ORDER NUMBER", "CUSTOMER", "DATE", "GRAND TOTAL"),
  },
  "/en/sales/sales-direct-sales": {
    title: "Direct Invoices",
    module: "Sales",
    addLabel: "Add Direct Invoice",
    addHref: "/en/sales/sales-direct-sale-create",
    columns: cols("ORDER NUMBER", "CUSTOMER", "SALE DATE", "GRAND TOTAL"),
  },
  "/en/sales/customer-debits": {
    title: "Customer Debits",
    module: "Sales",
    addLabel: "Add Customer Debit",
    addHref: "/en/sales/customer-debit-create",
    columns: cols("CREDIT NUMBER", "CUSTOMER", "DATE", "TOTAL AMOUNT"),
  },
  "/en/pos/outlets": {
    title: "POS Outlets",
    module: "POS",
    addLabel: "Add Outlet",
    addHref: "/en/pos/outlet-create",
    hideFilterToggle: true,
    columns: [
      { key: "name", label: "NAME", type: "link" },
      { key: "number", label: "NUMBER" },
      { key: "warehouse", label: "WAREHOUSE", type: "link" },
      { key: "cash_account", label: "CASH ACCOUNT" },
      { key: "account_balance", label: "ACCOUNT BALANCE" },
      { key: "last_user", label: "LAST USER" },
      { key: "address", label: "ADDRESS" },
      statusCol,
      actionCol,
    ],
    rows: [
      {
        id: 270,
        name: "Food Cart",
        number: "0174455554",
        warehouse: "Food Cart",
        cash_account: "Pos Cash",
        account_balance: "৳ 2,700.00",
        last_user: "biznify@softifybd.com",
        address: "Dhaka",
        status: "Active",
        mobile_banking: ["Bkash Merchant", "Rocket"],
        add_mobile_banking: true,
      },
      {
        id: 271,
        name: "Ash Bazar - Jamalkhan",
        number: "N/A",
        warehouse: "Jamalkhan",
        cash_account: "Cash Jamalkhan",
        account_balance: "৳ 8,900.00",
        last_user: "dev.biznify@softifybd.com",
        address: "N/A",
        status: "Inactive",
      },
      {
        id: 272,
        name: "Bogura Outlet",
        number: "16222",
        warehouse: "Default",
        cash_account: "Bogura Outlet",
        account_balance: "৳ 571,609.73",
        last_user: "demo@biznify.com.bd",
        address: "Akash tower",
        status: "Active",
      },
      {
        id: 273,
        name: "Dinajpuir Outlet",
        number: "N/A",
        warehouse: "Default",
        cash_account: "Dinajpur Outlet",
        account_balance: "৳ 2,800.00",
        last_user: "biznify@softifybd.com",
        address: "N/A",
        status: "Active",
      },
      {
        id: 274,
        name: "Narayangnj Outlet",
        number: "N/A",
        warehouse: "Default",
        cash_account: "Narayanganj outllet",
        account_balance: "৳ 2,800.00",
        last_user: "dev.biznify@softifybd.com",
        address: "N/A",
        status: "Active",
      },
      {
        id: 275,
        name: "Gulsan",
        number: "N/A",
        warehouse: "Mirpur",
        cash_account: "Cash",
        account_balance: "৳ -1,951,985.17",
        last_user: "demo@biznify.com.bd",
        address: "N/A",
        status: "Inactive",
      },
    ],
    totalEntries: 6,
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
  "/en/pos/outlet-create": {
    type: "special",
    special: "outlet-form",
    title: "Add POS Outlet",
    module: "POS",
    backHref: "/en/pos/outlets",
    formMode: "create",
  },
  "/en/pos/outlet-update": {
    type: "special",
    special: "outlet-form",
    title: "Edit POS Outlet",
    module: "POS",
    backHref: "/en/pos/outlets",
    formMode: "edit",
  },
  "/en/item-config/add-item": {
    type: "special",
    special: "add-item",
    title: "Add Item",
    module: "Item",
  },
  "/en/item-config/add-item-group": {
    type: "special",
    special: "add-item-group",
    title: "Add Item Group",
    module: "Item",
  },
  "/en/item-config/price-list-create": {
    type: "form",
    layout: "price-list",
    formMode: "create",
    title: "Add Price List",
    module: "Item",
    backHref: "/en/item-config/price-list",
  },
  "/en/item-config/price-list-update": {
    type: "form",
    layout: "price-list",
    formMode: "edit",
    title: "Edit Price List",
    module: "Item",
    backHref: "/en/item-config/price-list",
  },
  "/en/item-config/price-list-details": {
    type: "form",
    layout: "price-list",
    formMode: "details",
    title: "Price List Details",
    module: "Item",
    backHref: "/en/item-config/price-list",
  },
  "/en/sales/customer-create": {
    type: "form",
    title: "Add Customer",
    module: "Sales",
    backHref: "/en/sales/customers",
    layout: "entity",
    imageLabel: "Upload Photo",
    extraSectionTitle: "Address Information",
    fields: [
      {
        key: "name",
        label: "Customer Name",
        required: true,
        placeholder: "Enter Customer Name",
        section: "basic",
      },
      {
        key: "phone",
        label: "Phone Number",
        placeholder: "Enter Phone Number",
        section: "basic",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter Email Address",
        section: "basic",
      },
      {
        key: "customer_type",
        label: "Customer Type",
        type: "select",
        placeholder: "Select Customer Type",
        options: [
          "Service Point",
          "Sales Repr.",
          "VIP",
          "Wholesale V",
          "Online",
          "Corporate Supplier",
        ],
        section: "basic",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "Enter Website",
        section: "basic",
      },
      {
        key: "as_supplier",
        label: "As Supplier",
        type: "select",
        placeholder: "Select Supplier",
        options: ["None", "Also Supplier"],
        section: "basic",
      },
      {
        key: "price_list",
        label: "Price List",
        type: "select",
        placeholder: "Select Price List",
        options: ["Wholesale", "Retail", "VIP", "Import"],
        section: "basic",
      },
      {
        key: "opening_balance",
        label: "Opening Balance",
        type: "number",
        placeholder: "0.00",
        defaultValue: "0.00",
        section: "balance",
      },
      {
        key: "add_address",
        label: "Add Address",
        type: "toggle",
        section: "toggle",
      },
      {
        key: "country",
        label: "Country",
        type: "select",
        placeholder: "Select Country",
        options: ["Bangladesh", "India", "USA"],
        section: "contact",
      },
      {
        key: "state",
        label: "State/Division",
        type: "select",
        placeholder: "Select division",
        options: ["Dhaka", "Chittagong", "Rajshahi", "Khulna"],
        section: "contact",
      },
      {
        key: "district",
        label: "District",
        type: "select",
        placeholder: "Select district",
        options: ["Dhaka", "Gazipur", "Narayanganj"],
        section: "contact",
      },
      {
        key: "city",
        label: "City",
        type: "select",
        placeholder: "Select city",
        options: ["Dhaka", "Chittagong", "Sylhet"],
        section: "contact",
      },
      {
        key: "address_line_1",
        label: "Address Line 1",
        required: true,
        placeholder: "Address Line 1",
        section: "contact",
      },
      {
        key: "address_line_2",
        label: "Address Line 2",
        placeholder: "Address Line 2",
        section: "contact",
      },
    ],
  },
  "/en/purchase/supplier-create": {
    type: "form",
    title: "Add Supplier",
    module: "Purchase",
    backHref: "/en/purchase/suppliers",
    layout: "entity",
    imageLabel: "Upload Photo",
    fields: [
      {
        key: "name",
        label: "Supplier Name",
        required: true,
        placeholder: "Enter Supplier Name",
        section: "basic",
      },
      {
        key: "supplier_type",
        label: "Supplier Type",
        type: "select",
        required: true,
        placeholder: "Select supplier type",
        options: ["paper supplier", "bag supplier", "Exporter", "Whole Seller", "Distributors"],
        section: "basic",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter Email",
        section: "basic",
      },
      {
        key: "phone",
        label: "Mobile Number",
        type: "tel",
        placeholder: "Enter Mobile Number",
        section: "basic",
      },
      {
        key: "opening_balance",
        label: "Opening Balance",
        type: "number",
        placeholder: "0.00",
        defaultValue: "0.00",
        section: "balance",
      },
      {
        key: "add_contact_info",
        label: "Add Contact Info",
        type: "toggle",
        section: "toggle",
      },
      {
        key: "contact_person",
        label: "Contact Person Name",
        required: true,
        placeholder: "Enter Contact Person Name",
        section: "contact",
      },
      {
        key: "country",
        label: "Country",
        type: "select",
        placeholder: "Select Country",
        options: ["Bangladesh", "India", "USA"],
        section: "contact",
      },
      {
        key: "state",
        label: "State/Division",
        type: "select",
        placeholder: "Select division",
        options: ["Dhaka", "Chittagong", "Rajshahi", "Khulna"],
        section: "contact",
      },
      {
        key: "district",
        label: "District",
        type: "select",
        placeholder: "Select district",
        options: ["Dhaka", "Gazipur", "Narayanganj"],
        section: "contact",
      },
      {
        key: "city",
        label: "City",
        type: "select",
        placeholder: "Select city",
        options: ["Dhaka", "Chittagong", "Sylhet"],
        section: "contact",
      },
      {
        key: "address_line_1",
        label: "Address Line 1",
        required: true,
        placeholder: "Address Line 1",
        section: "contact",
      },
      {
        key: "address_line_2",
        label: "Address Line 2",
        placeholder: "Address Line 2",
        section: "contact",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "Enter Name",
        section: "contact",
      },
    ],
  },
  "/en/sales/quotation-create": {
    type: "special",
    special: "txn-form",
    title: "Add Quotation",
    module: "Sales",
    backHref: "/en/sales/quotation-list",
    numberLabel: "Quotation Number",
    dateLabel: "Quotation Date",
    showValidTill: true,
    showPayment: false,
  },
  "/en/sales/sales-direct-sale-create": {
    type: "special",
    special: "txn-form",
    title: "Add Direct Sale",
    module: "Sales",
    backHref: "/en/sales/sales-direct-sales",
    numberLabel: "Direct Sale Number",
    dateLabel: "Sale Date",
    showPayment: true,
  },
  "/en/sales/sales-direct-sale-details": {
    type: "special",
    special: "txn-detail",
    title: "Direct Sale Details",
    module: "Sales",
    backHref: "/en/sales/sales-direct-sales",
    editHref: "/en/sales/sales-direct-sale-create",
  },
  "/en/sales/sales-order-create": {
    type: "special",
    special: "txn-form",
    title: "Add Order",
    module: "Sales",
    backHref: "/en/sales/sales-orders",
    numberLabel: "Order Number",
    dateLabel: "Order Date",
    showPayment: false,
  },
  "/en/sales/customer-debit-create": {
    type: "form",
    title: "Add Customer Debit",
    module: "Sales",
    backHref: "/en/sales/customer-debits",
    fields: [
      {
        key: "customer",
        label: "Customer",
        type: "select",
        required: true,
        options: ["karim saheb", "Rahim", "Masud Rahman"],
        placeholder: "Select Customer",
      },
      { key: "date", label: "Date", type: "date", required: true },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["Debit Note", "Opening Balance", "Adjustment"],
        required: true,
      },
      { key: "reference", label: "Reference", placeholder: "Reference" },
      {
        key: "amount",
        label: "Total Amount",
        type: "number",
        required: true,
        placeholder: "0.00",
      },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Notes" },
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
          rows: o.rows || mockRows(o.columns || cols("NAME"), 15),
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

  // Item create routes (live list scrape does not include addHref)
  if (map["/en/item-config/items"]) {
    map["/en/item-config/items"].type = "special";
    map["/en/item-config/items"].special = "items";
    map["/en/item-config/items"].title = "Items";
    map["/en/item-config/items"].module = "Item";
  }
  if (map["/en/pos/outlets"]) {
    map["/en/pos/outlets"].addHref = "/en/pos/outlet-create";
    map["/en/pos/outlets"].addLabel = "Add Outlet";
    map["/en/pos/outlets"].hideFilterToggle = true;
    map["/en/pos/outlets"].title = "POS Outlets";
  }
  if (map["/en/item-config/price-list"]) {
    map["/en/item-config/price-list"].addHref = "/en/item-config/price-list-create";
    map["/en/item-config/price-list"].addLabel = "Add Price List";
    map["/en/item-config/price-list"].hideFilterToggle = true;
    map["/en/item-config/price-list"].rows = [
      {
        id: 1,
        name: "Strip Light - Purchase",
        transaction_type: "Purchase",
        pricebook_type: "Individual Items",
        status: "Active",
      },
      {
        id: 2,
        name: "Light - Sales",
        transaction_type: "Sales",
        pricebook_type: "Individual Items",
        status: "Active",
      },
      {
        id: 3,
        name: "Light - Purchs",
        transaction_type: "Purchase",
        pricebook_type: "Individual Items",
        status: "Active",
      },
      {
        id: 4,
        name: "Light",
        transaction_type: "Purchase",
        pricebook_type: "Individual Items",
        status: "Active",
      },
      {
        id: 5,
        name: "oil",
        transaction_type: "Sales",
        pricebook_type: "All Items",
        status: "Active",
      },
      {
        id: 6,
        name: "Import",
        transaction_type: "Sales",
        pricebook_type: "Individual Items",
        status: "Active",
      },
      {
        id: 7,
        name: "Bulk Purchase",
        transaction_type: "Purchase",
        pricebook_type: "Individual Items",
        status: "Active",
      },
      {
        id: 8,
        name: "Wholesale",
        transaction_type: "Sales",
        pricebook_type: "All Items",
        status: "Active",
      },
    ];
    map["/en/item-config/price-list"].totalEntries = 8;
  }
  if (map["/en/purchase/suppliers"]) {
    map["/en/purchase/suppliers"].addHref = "/en/purchase/supplier-create";
    map["/en/purchase/suppliers"].addLabel = "Add Supplier";
  }
  if (map["/en/sales/customers"]) {
    map["/en/sales/customers"].addHref = "/en/sales/customer-create";
    map["/en/sales/customers"].addLabel = "Add Customer";
    map["/en/sales/customers"].hideFilterToggle = false;
    map["/en/sales/customers"].filters = [
      { key: "type", label: "Customer Types", placeholder: "ex: VIP, Retailer" },
      { key: "status", label: "Status", placeholder: "ex: Active, Inactive" },
      { key: "alsoSupplier", label: "Also Supplier", placeholder: "ex: Yes, No" },
    ];
  }
  if (map["/en/sales/customer-types"]) {
    map["/en/sales/customer-types"].addLabel = "Add";
    map["/en/sales/customer-types"].hideFilterToggle = true;
  }
  if (map["/en/sales/sales-direct-sales"]) {
    map["/en/sales/sales-direct-sales"].addHref = "/en/sales/sales-direct-sale-create";
    map["/en/sales/sales-direct-sales"].addLabel = "Add Direct Invoice";
    map["/en/sales/sales-direct-sales"].summaryCards = [
      {
        key: "sub_total",
        label: "Sub Total Amount",
        value: "৳ 40,386,313.78",
        tone: "blue",
        icon: "work_outline",
      },
      {
        key: "tax",
        label: "Total Tax Amount",
        value: "৳ 389,046.38",
        tone: "pink",
        icon: "monitor_heart",
      },
      {
        key: "discount",
        label: "Total Discount Amount",
        value: "৳ 37,343.56",
        tone: "green",
        icon: "percent",
      },
      {
        key: "grand",
        label: "Grand Total Amount",
        value: "৳ 40,768,249.25",
        tone: "purple",
        icon: "add",
      },
    ];
    map["/en/sales/sales-direct-sales"].filters = [
      {
        key: "customer",
        label: "Select Customer",
        placeholder: "Select Customer",
        options: ["Dalim Hossain", "Test Customer", "Walk in Customer.", "karim saheb"],
      },
      {
        key: "status",
        label: "Status",
        placeholder: "Status",
        options: ["Completed", "Cancelled", "Draft"],
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
    ];
    map["/en/sales/sales-direct-sales"].columns = [
      { key: "order_number", label: "ORDER NUMBER", type: "link" },
      { key: "sale_date", label: "SALE DATE" },
      { key: "customer", label: "CUSTOMER", type: "link" },
      { key: "sub_total", label: "SUB TOTAL" },
      { key: "total_tax", label: "TOTAL TAX" },
      { key: "total_discount", label: "TOTAL DISCOUNT" },
      { key: "grand_total", label: "GRAND TOTAL" },
      { key: "status", label: "STATUS", type: "status" },
      { key: "action", label: "ACTION", type: "action" },
    ];
    map["/en/sales/sales-direct-sales"].rows = [
      {
        id: 1,
        order_number: "DSO-001010",
        sale_date: "14 Sep 2026",
        customer: "Dalim Hossain",
        sub_total: "৳ 120",
        total_tax: "৳ 0",
        total_discount: "৳ 0",
        grand_total: "৳ 120",
        status: "Completed",
      },
      {
        id: 2,
        order_number: "DSO-001009",
        sale_date: "13 Sep 2026",
        customer: "Test Customer",
        sub_total: "৳ 600",
        total_tax: "৳ 0",
        total_discount: "৳ 0",
        grand_total: "৳ 600",
        status: "Completed",
      },
      {
        id: 3,
        order_number: "DSO-001008",
        sale_date: "13 Sep 2026",
        customer: "Dalim Hossain",
        sub_total: "৳ 60,000",
        total_tax: "৳ 0",
        total_discount: "৳ 0",
        grand_total: "৳ 60,000",
        status: "Completed",
      },
      {
        id: 4,
        order_number: "DSO-001007",
        sale_date: "12 Sep 2026",
        customer: "Walk in Customer.",
        sub_total: "৳ 2,300",
        total_tax: "৳ 0",
        total_discount: "৳ 0",
        grand_total: "৳ 2,300",
        status: "Completed",
      },
      {
        id: 5,
        order_number: "DSO-001006",
        sale_date: "11 Sep 2026",
        customer: "karim saheb",
        sub_total: "৳ 1,150",
        total_tax: "৳ 0",
        total_discount: "৳ 0",
        grand_total: "৳ 1,150",
        status: "Completed",
      },
    ];
  }
  if (map["/en/sales/quotation-list"]) {
    map["/en/sales/quotation-list"].addHref = "/en/sales/quotation-create";
    map["/en/sales/quotation-list"].addLabel = "Add Quotation";
  }
  if (map["/en/sales/sales-orders"]) {
    map["/en/sales/sales-orders"].addHref = "/en/sales/sales-order-create";
    map["/en/sales/sales-orders"].addLabel = "Add Order";
  }
  if (map["/en/sales/customer-debits"]) {
    map["/en/sales/customer-debits"].addHref = "/en/sales/customer-debit-create";
    map["/en/sales/customer-debits"].addLabel = "Add Customer Debit";
  }
  // Pages with no create CTA on live
  for (const href of [
    "/en/sales/sales-deliveries",
    "/en/sales/sales-invoices",
    "/en/sales/sales-returns",
    "/en/sales/batch-payments",
    "/en/sales/sales-payments",
    "/en/sales/refunds",
  ]) {
    if (map[href]) map[href].addLabel = "";
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
  if (PAGE_CONFIGS[pathname]) return PAGE_CONFIGS[pathname];

  if (pathname.startsWith("/en/item-config/price-list-update")) {
    return PAGE_CONFIGS["/en/item-config/price-list-update"] || null;
  }
  if (pathname.startsWith("/en/item-config/price-list-details")) {
    return PAGE_CONFIGS["/en/item-config/price-list-details"] || null;
  }
  if (pathname.startsWith("/en/pos/outlet-update")) {
    return PAGE_CONFIGS["/en/pos/outlet-update"] || null;
  }
  if (pathname.startsWith("/en/sales/sales-direct-sale-details")) {
    return PAGE_CONFIGS["/en/sales/sales-direct-sale-details"] || null;
  }

  return null;
}

export function allPagePaths() {
  return Object.keys(PAGE_CONFIGS);
}
