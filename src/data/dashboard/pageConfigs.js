import { flattenNav } from "./nav";
import { MANUFACTURING_LIST, MANUFACTURING_FORMS } from "./manufacturing";
import { buildEmployeeRows } from "./employees";
import { SETTINGS_PAGE_CONFIGS } from "./settingsConfigs";

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
  "/en/subscriptions": {
    type: "special",
    special: "subscriptions",
    title: "Subscriptions",
    module: "Account",
  },
  "/en/tax/tax-list": {
    title: "VAT",
    module: "Configuration",
    addLabel: "Add VAT",
    addHref: "/en/tax/tax-create",
    hideFilterToggle: true,
    columns: [
      { key: "name", label: "NAME", type: "link" },
      { key: "rate____", label: "RATE (%)" },
      actionCol,
    ],
  },
  "/en/discount/discount-list": {
    title: "Discount",
    module: "Configuration",
    addLabel: "Add Discount",
    addHref: "/en/discount/discount-create",
    hideFilterToggle: true,
    columns: [
      { key: "name", label: "NAME", type: "link" },
      { key: "applied_to", label: "APPLIED TO" },
      { key: "rate", label: "RATE" },
      { key: "effective_from", label: "EFFECTIVE FROM" },
      { key: "effective_to", label: "EFFECTIVE TO" },
      actionCol,
    ],
  },
  "/en/settings/payment-methods": {
    title: "Payment Methods",
    module: "Configuration",
    addLabel: "Add New",
    addHref: "/en/settings/payment-method-create",
    hideFilterToggle: true,
    columns: [
      { key: "name", label: "NAME", type: "link" },
      { key: "payment_type", label: "PAYMENT TYPE" },
      { key: "account", label: "ACCOUNT" },
      { key: "expense_account", label: "EXPENSE ACCOUNT" },
      { key: "charge", label: "CHARGE" },
      statusCol,
      actionCol,
    ],
  },
  "/en/inventory/warehouses": {
    title: "Warehouses",
    module: "Configuration",
    addLabel: "Add New",
    addHref: "/en/inventory/warehouse-create",
    hideFilterToggle: true,
    columns: [
      { key: "name", label: "NAME", type: "link" },
      actionCol,
    ],
  },
  "/en/inventory/bin-locations": {
    title: "Bin Locations",
    module: "Configuration",
    type: "special",
    special: "bin-locations",
  },
  "/en/settings/accounting-settings": {
    title: "Accounting Settings",
    module: "Configuration",
    type: "special",
    special: "config-settings",
  },
  "/en/sales/sales-settings": {
    title: "Sales Settings",
    module: "Configuration",
    type: "special",
    special: "config-settings",
  },
  "/en/settings/purchase-setting": {
    title: "Purchase Settings",
    module: "Configuration",
    type: "special",
    special: "config-settings",
  },
  "/en/settings/customer-setting": {
    title: "Customer Settings",
    module: "Configuration",
    type: "special",
    special: "config-settings",
  },
  "/en/settings/template-settings": {
    title: "Template Setting",
    module: "Configuration",
    type: "special",
    special: "template-settings",
  },
  "/en/settings/delivery-channels": {
    title: "Delivery Channels",
    module: "Configuration",
    type: "special",
    special: "delivery-channels",
  },
  "/en/settings/delivery-charges": {
    title: "Delivery Charges",
    module: "Configuration",
    addLabel: "Create",
    secondaryAddLabel: "Generate",
    columns: cols(
      "COUNTRY",
      "DIVISION",
      "DISTRICT",
      "THANA",
      "UP TO 0.5 KG",
      "(0.5 - 1) KG",
      "(1 - 2) KG",
      "(2 - 3) KG",
      "PER KG ABOVE 3 KG"
    ),
  },
  "/en/inventory/adjustment-reasons": {
    title: "Adjustment Reasons",
    module: "Configuration",
    addLabel: "Add New",
    addHref: "/en/inventory/adjustment-reason-create",
    hideFilterToggle: true,
    columns: [
      { key: "adjustment_reason", label: "ADJUSTMENT REASON", type: "link" },
      { key: "type", label: "TYPE" },
      { key: "description", label: "DESCRIPTION" },
      { key: "account", label: "ACCOUNT" },
      statusCol,
      actionCol,
    ],
  },
  "/en/settings/pos-settings": {
    title: "Pos Settings",
    module: "Configuration",
    type: "special",
    special: "config-settings",
  },
  "/en/settings/hr-payroll-settings": {
    title: "HRM Settings",
    module: "Configuration",
    type: "special",
    special: "config-settings",
  },
  "/en/settings/custom-fields": {
    title: "Custom Fields",
    module: "Configuration",
    addLabel: "Add New",
    addHref: "/en/settings/custom-field-create",
    hideFilterToggle: true,
    columns: [
      { key: "name", label: "NAME", type: "link" },
      { key: "description", label: "DESCRIPTION" },
      { key: "applied_on", label: "APPLIED ON" },
      { key: "data_type", label: "DATA TYPE" },
      statusCol,
      actionCol,
    ],
  },
  "/en/settings/advanced-settings": {
    title: "Advanced Settings",
    module: "Configuration",
    type: "special",
    special: "config-settings",
  },
  "/en/item-config/uom-conversions": {
    title: "UoM Conversions",
    module: "Configuration",
    type: "special",
    special: "uom-conversions",
  },
  "/en/sales/customers": {
    title: "Customers",
    module: "Sales",
    addLabel: "Add Customer",
    addHref: "/en/sales/customer-create",
    filters: [
      { key: "type", label: "Customer Types", placeholder: "ex: VIP, Retailer" },
      { key: "status", label: "Status", placeholder: "ex: Active, Inactive" },
      { key: "alsoSupplier", label: "Also Supplier", placeholder: "ex: Yes, No" },
    ],
    columns: [
      { key: "_check", label: "", type: "checkbox" },
      { key: "name", label: "NAME", type: "link", showIcon: true },
      { key: "phone_number", label: "PHONE NUMBER" },
      { key: "email", label: "EMAIL" },
      { key: "customer_since", label: "CUSTOMER SINCE" },
      { key: "customer_code", label: "CUSTOMER CODE" },
      { key: "customer_type", label: "CUSTOMER TYPE" },
      statusCol,
      actionCol,
    ],
    totalEntries: 3372,
  },
  "/en/sales/customer-types": {
    title: "Customer Types",
    module: "Sales",
    addLabel: "Add",
    hideFilterToggle: true,
    columns: [
      { key: "name", label: "NAME", type: "link" },
      statusCol,
      actionCol,
    ],
    totalEntries: 36,
  },
  "/en/settings/email-templates": {
    title: "Email Templates",
    module: "Configuration",
    addLabel: "Add Template",
    hideFilterToggle: true,
    columns: [
      { key: "name", label: "NAME", type: "link" },
      { key: "type", label: "TYPE" },
      statusCol,
      actionCol,
    ],
    totalEntries: 16,
  },
  "/en/support-tickets": {
    title: "Support & Tickets",
    module: "Support",
    addLabel: "Create Support Ticket",
    addHref: "/en/support-tickets/create",
    hideFilterToggle: true,
    filters: [
      {
        key: "category",
        label: "Select Category",
        placeholder: "Select Category",
        options: [
          "Quotations",
          "Macreseller Support",
          "Salary sheet generate",
          "Billing Support",
          "Login / Password",
          "General Support",
        ],
      },
      {
        key: "status",
        label: "Status",
        placeholder: "Status",
        options: ["Open", "InProgress", "Closed", "Resolved"],
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
      { key: "ticket_number", label: "TICKET NUMBER", type: "link" },
      { key: "date", label: "DATE" },
      { key: "issue", label: "ISSUE", type: "description" },
      { key: "category", label: "CATEGORY" },
      { key: "email", label: "EMAIL" },
      { key: "phone_number", label: "PHONE NUMBER" },
      statusCol,
      actionCol,
    ],
    totalEntries: 62904,
  },
  "/en/acl/role/index": {
    title: "Roles",
    module: "ACL",
    addLabel: "Create Role",
    addHref: "/en/acl/role/create",
    apiEndpoint: "/acl/roles",
    hideFilterToggle: true,
    columns: [
      { key: "role_name", label: "ROLE NAME", type: "link" },
      { key: "redirect_url", label: "REDIRECT URL" },
      actionCol,
    ],
    rows: [
      { id: 1, role_name: "Administrator", redirect_url: "/dashboard" },
      { id: 2, role_name: "Minhaj", redirect_url: "/accounting/dashboard" },
      { id: 3, role_name: "Direcor", redirect_url: "/accounting/dashboard" },
      { id: 4, role_name: "Cashier", redirect_url: "/pos/poscountercheckin" },
      { id: 5, role_name: "sajal", redirect_url: "/sales/sales-direct-sales" },
      { id: 6, role_name: "Boss", redirect_url: "/inventory/item-stock" },
      { id: 7, role_name: "Store Manager", redirect_url: "/pos/poscountercheckin" },
      { id: 8, role_name: "Manager Demo", redirect_url: "/dashboard" },
    ],
    totalEntries: 44,
  },
  "/en/acl/user/index": {
    title: "Users",
    module: "ACL",
    addLabel: "Invite an User",
    addHref: "/en/acl/user/invite",
    apiEndpoint: "/acl/users",
    hideFilterToggle: true,
    columns: [
      { key: "email", label: "EMAIL", type: "link" },
      statusCol,
      actionCol,
    ],
    rows: [
      { id: 1, email: "dev.biznify@softifybd.com", status: "Active" },
      { id: 2, email: "demo@biznify.com.bd", status: "Active" },
      { id: 3, email: "poscounter3@gmail.com", status: "Inactive" },
      { id: 4, email: "rmhasib.softifybd@gmail.com", status: "Active" },
      { id: 5, email: "touhid.softifybd@gmail.com", status: "Active" },
      { id: 6, email: "biznify@softifybd.com", status: "Active" },
      { id: 7, email: "monoj@softifybd.com", status: "Active" },
      { id: 8, email: "cashier@demo.com", status: "Inactive" },
    ],
    totalEntries: 22,
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
    addLabel: "Add Single Item",
    addHref: "/en/item-config/add-item",
    columns: cols("SKU", "NAME", "CATEGORY", "PRICE", "STOCK"),
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
    addHref: "/en/hrm/employee/employee-create",
    hideFilterToggle: true,
    filters: [
      {
        key: "select_employee_type",
        label: "Select Employee Type",
        placeholder: "Select Employee Type",
        options: ["Full Time", "Part Time", "Contract", "Intern"],
      },
      {
        key: "select_department",
        label: "Select Department",
        placeholder: "Select Department",
        options: [
          "Sales",
          "Digital Marketing",
          "Accounts",
          "HR",
          "Development",
          "Support",
          "Operations",
        ],
      },
      {
        key: "select_employment_status",
        label: "Select Employment Status",
        placeholder: "Select Employment Status",
        options: ["Active", "Inactive"],
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
      { key: "_check", label: "", type: "checkbox" },
      { key: "code", label: "CODE", type: "link" },
      { key: "name", label: "NAME" },
      { key: "department", label: "DEPARTMENT" },
      { key: "position", label: "POSITION" },
      { key: "employment_type", label: "EMPLOYMENT TYPE" },
      { key: "email", label: "EMAIL" },
      { key: "phone_number", label: "PHONE NUMBER" },
      { key: "joining_date", label: "JOINING DATE" },
      statusCol,
      actionCol,
    ],
    totalEntries: 73,
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
      { key: "name", label: "NAME" },
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
  ...MANUFACTURING_LIST,
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
  ...MANUFACTURING_FORMS,
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
  "/en/hrm/employee/employee-create": {
    type: "special",
    special: "employee-form",
    formMode: "create",
    title: "Add Employee",
    module: "HRM",
    backHref: "/en/hrm/employee/employees",
  },
  "/en/hrm/employee/employee-update": {
    type: "special",
    special: "employee-form",
    formMode: "edit",
    title: "Edit Employee",
    module: "HRM",
    backHref: "/en/hrm/employee/employees",
  },
  "/en/hrm/employee/employee-details": {
    type: "special",
    special: "employee-details",
    title: "Employee Details",
    module: "HRM",
    backHref: "/en/hrm/employee/employees",
  },
  "/en/sales/customer-create": {
    type: "form",
    title: "Add Customer",
    module: "Sales",
    backHref: "/en/sales/customers",
    layout: "entity",
    entity: "customer",
    imageLabel: "Upload Photo",
    basicGridCols: 3,
    requiredKeys: ["name"],
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
        type: "tel",
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
          "Offline Sales",
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
        options: ["Yes", "No"],
        section: "basic",
      },
      {
        key: "price_list",
        label: "Price List",
        type: "select",
        placeholder: "Select Price List",
        options: ["Light - Sales", "Wholesale", "oil"],
        section: "basic",
      },
      {
        key: "opening_balance",
        label: "Opening Balance",
        type: "number",
        placeholder: "0.00",
        defaultValue: "0.00",
        section: "balance",
        help: true,
      },
      {
        key: "add_address",
        label: "Add Address",
        type: "toggle",
        section: "toggle",
        clearWarning:
          "If you toggle off 'Add Address', your address data will be cleared from the form!",
      },
      {
        key: "country",
        label: "Country",
        type: "select",
        placeholder: "Select Country",
        options: ["Bangladesh", "India", "USA"],
        section: "address",
      },
      {
        key: "state",
        label: "State/Division",
        type: "select",
        placeholder: "Select division",
        options: ["Dhaka", "Chittagong", "Rajshahi", "Khulna"],
        section: "address",
      },
      {
        key: "district",
        label: "District",
        type: "select",
        placeholder: "Select district",
        options: ["Dhaka", "Gazipur", "Narayanganj"],
        section: "address",
      },
      {
        key: "city",
        label: "City",
        type: "select",
        placeholder: "Select city",
        options: ["Dhaka", "Chittagong", "Sylhet"],
        section: "address",
      },
      {
        key: "address_line_1",
        label: "Address Line 1",
        required: true,
        placeholder: "Address Line 1",
        section: "address",
      },
      {
        key: "address_line_2",
        label: "Address Line 2",
        placeholder: "Address Line 2",
        section: "address",
      },
    ],
  },
  "/en/sales/customer-update": {
    type: "form",
    title: "Update Customer",
    module: "Sales",
    backHref: "/en/sales/customers",
    layout: "entity",
    entity: "customer",
    imageLabel: "Upload Photo",
    basicGridCols: 3,
    requiredKeys: ["name"],
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
        type: "tel",
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
          "Offline Sales",
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
        options: ["Yes", "No"],
        section: "basic",
      },
      {
        key: "price_list",
        label: "Price List",
        type: "select",
        placeholder: "Select Price List",
        options: ["Light - Sales", "Wholesale", "oil"],
        section: "basic",
      },
      {
        key: "opening_balance",
        label: "Opening Balance",
        type: "number",
        placeholder: "0.00",
        defaultValue: "0.00",
        section: "balance",
        help: true,
      },
      {
        key: "credit_limit",
        label: "Credit Limit",
        type: "number",
        placeholder: "0.00",
        defaultValue: "0.00",
        section: "balance",
        help: true,
      },
      {
        key: "add_address",
        label: "Add Address",
        type: "toggle",
        section: "toggle",
        clearWarning:
          "If you toggle off 'Add Address', your address data will be cleared from the form!",
      },
      {
        key: "country",
        label: "Country",
        type: "select",
        placeholder: "Select Country",
        options: ["Bangladesh", "India", "USA"],
        section: "address",
      },
      {
        key: "state",
        label: "State/Division",
        type: "select",
        placeholder: "Select division",
        options: ["Dhaka", "Chittagong", "Rajshahi", "Khulna"],
        section: "address",
      },
      {
        key: "district",
        label: "District",
        type: "select",
        placeholder: "Select district",
        options: ["Dhaka", "Gazipur", "Narayanganj"],
        section: "address",
      },
      {
        key: "city",
        label: "City",
        type: "select",
        placeholder: "Select city",
        options: ["Dhaka", "Chittagong", "Sylhet"],
        section: "address",
      },
      {
        key: "address_line_1",
        label: "Address Line 1",
        required: true,
        placeholder: "Address Line 1",
        section: "address",
      },
      {
        key: "address_line_2",
        label: "Address Line 2",
        placeholder: "Address Line 2",
        section: "address",
      },
    ],
  },
  "/en/sales/customer-details": {
    type: "special",
    special: "customer-details",
    title: "Customer Details",
    module: "Sales",
    backHref: "/en/sales/customers",
  },
  "/en/purchase/supplier-create": {
    type: "form",
    title: "Add Supplier",
    module: "Purchase",
    backHref: "/en/purchase/suppliers",
    layout: "entity",
    imageLabel: "Upload Photo",
    requiredKeys: ["name", "supplier_type"],
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
    salesApiKey: "quotations",
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
    salesApiKey: "directInvoices",
    salesDocType: "direct_invoice",
  },
  "/en/sales/sales-direct-sale-details": {
    type: "special",
    special: "txn-details",
    title: "Direct Sale Details",
    module: "Sales",
    backHref: "/en/sales/sales-direct-sales",
    editHref: "/en/sales/sales-direct-sale-create",
    txnType: "Direct Sale",
    salesApiKey: "directInvoices",
  },
  "/en/sales/quotation-details": {
    type: "special",
    special: "txn-details",
    title: "Quotation Details",
    module: "Sales",
    backHref: "/en/sales/quotation-list",
    editHref: "/en/sales/quotation-create",
    txnType: "Quotation",
    salesApiKey: "quotations",
  },
  "/en/sales/sales-order-details": {
    type: "special",
    special: "txn-details",
    title: "Sales Order Details",
    module: "Sales",
    backHref: "/en/sales/sales-orders",
    editHref: "/en/sales/sales-order-create",
    txnType: "Sales Order",
    salesApiKey: "orders",
  },
  "/en/sales/sales-delivery-details": {
    type: "special",
    special: "txn-details",
    title: "Delivery Details",
    module: "Sales",
    backHref: "/en/sales/sales-deliveries",
    txnType: "Delivery",
    salesApiKey: "deliveries",
  },
  "/en/sales/sales-invoice-details": {
    type: "special",
    special: "txn-details",
    title: "Invoice Details",
    module: "Sales",
    backHref: "/en/sales/sales-invoices",
    txnType: "Invoice",
    salesApiKey: "invoices",
  },
  "/en/sales/sales-return-details": {
    type: "special",
    special: "txn-details",
    title: "Return Details",
    module: "Sales",
    backHref: "/en/sales/sales-returns",
    txnType: "Sales Return",
    salesApiKey: "returns",
  },
  "/en/sales/batch-payment-details": {
    type: "special",
    special: "txn-details",
    title: "Batch Payment Details",
    module: "Sales",
    backHref: "/en/sales/batch-payments",
    txnType: "Batch Payment",
    salesApiKey: "batchPayments",
  },
  "/en/sales/sales-payment-details": {
    type: "special",
    special: "txn-details",
    title: "Payment Details",
    module: "Sales",
    backHref: "/en/sales/sales-payments",
    txnType: "Sales Payment",
    salesApiKey: "payments",
  },
  "/en/sales/customer-debit-details": {
    type: "special",
    special: "txn-details",
    title: "Customer Debit Details",
    module: "Sales",
    backHref: "/en/sales/customer-debits",
    editHref: "/en/sales/customer-debit-create",
    txnType: "Customer Debit",
    salesApiKey: "customerDebits",
  },
  "/en/sales/refund-details": {
    type: "special",
    special: "txn-details",
    title: "Refund Details",
    module: "Sales",
    backHref: "/en/sales/refunds",
    txnType: "Refund",
    salesApiKey: "refunds",
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
    salesApiKey: "orders",
  },
  "/en/sales/customer-debit-create": {
    type: "special",
    special: "txn-form",
    title: "Add Customer Debit",
    module: "Sales",
    backHref: "/en/sales/customer-debits",
    numberLabel: "Debit Number",
    dateLabel: "Date",
    showPayment: false,
    showSalesPerson: false,
    showPriceList: false,
    salesApiKey: "customerDebits",
  },
  "/en/support-tickets/create": {
    type: "special",
    special: "support-ticket-form",
    title: "Create Support Ticket",
    module: "Support",
    backHref: "/en/support-tickets",
  },
  "/en/support-tickets/details": {
    type: "special",
    special: "support-ticket-details",
    title: "Support Ticket Details",
    module: "Support",
    backHref: "/en/support-tickets",
  },
  "/en/acl/role/create": {
    type: "special",
    special: "acl-role-form",
    title: "Create Role",
    module: "ACL",
    backHref: "/en/acl/role/index",
  },
  "/en/acl/role/role-details": {
    type: "special",
    special: "acl-role-details",
    title: "Role Details",
    module: "ACL",
    backHref: "/en/acl/role/index",
  },
  "/en/acl/user/user-details": {
    type: "special",
    special: "acl-user-details",
    title: "User Details",
    module: "ACL",
    backHref: "/en/acl/user/index",
  },
  "/en/acl/user/invite": {
    type: "special",
    special: "acl-user-invite",
    title: "Invite an User",
    module: "ACL",
    backHref: "/en/acl/user/index",
  },
  "/en/inventory/stock-adjustment-details": {
    type: "special",
    special: "inventory-details",
    inventoryKind: "adjustment",
    title: "Stock Adjustment Details",
    module: "Inventory",
    backHref: "/en/inventory/stock-adjustments",
  },
  "/en/inventory/warehouse-transfer-details": {
    type: "special",
    special: "inventory-details",
    inventoryKind: "transfer",
    title: "Stock Movement Details",
    module: "Inventory",
    backHref: "/en/inventory/warehouse-transfer-list",
  },
  "/en/item-config/item-details": {
    type: "special",
    special: "item-details",
    title: "Item Details",
    module: "Item",
    backHref: "/en/inventory/item-stock",
  },
  "/en/inventory/add-stock-adjustment": {
    type: "special",
    special: "inventory-form",
    inventoryForm: "adjustment",
    title: "Add Stock Adjustment",
    module: "Inventory",
    backHref: "/en/inventory/stock-adjustments",
  },
  "/en/inventory/warehouse-transfer": {
    type: "special",
    special: "inventory-form",
    inventoryForm: "transfer",
    title: "Add Stock Movement",
    module: "Inventory",
    backHref: "/en/inventory/warehouse-transfer-list",
  },
  "/en/inventory/warehouse-transfer-request-create": {
    type: "special",
    special: "inventory-form",
    inventoryForm: "transfer-request",
    title: "Request Stock Movement",
    module: "Inventory",
    backHref: "/en/inventory/warehouse-transfer-list",
  },
  "/en/inventory/receive-stock-create": {
    type: "special",
    special: "inventory-form",
    inventoryForm: "receive",
    title: "Receive Stock",
    module: "Inventory",
    backHref: "/en/inventory/receive-stock",
  },
  "/en/inventory/warehouse-transfer-initiate": {
    type: "special",
    special: "inventory-form",
    inventoryForm: "transfer-initiate",
    title: "Initiate Stock Movement",
    module: "Inventory",
    backHref: "/en/inventory/warehouse-transfer-list",
  },
  "/en/purchase/requisition-create": {
    type: "special",
    special: "txn-form",
    title: "Add Requisition",
    module: "Purchase",
    backHref: "/en/purchase/requisitions",
    numberLabel: "Requisition Number",
    dateLabel: "Requisition Date",
    partyLabel: "Supplier",
    partyPlaceholder: "Select Supplier",
    partyKey: "supplier",
    showSalesPerson: false,
    showPriceList: true,
    showPayment: false,
    notesLabel: "Order Note",
    purchaseApiKey: "requisitions",
  },
  "/en/purchase/direct-purchase-create": {
    type: "special",
    special: "txn-form",
    title: "Add a direct purchase",
    module: "Purchase",
    backHref: "/en/purchase/direct-purchases",
    numberLabel: "Direct Purchase Number",
    dateLabel: "Purchase Date",
    partyLabel: "Supplier",
    partyPlaceholder: "Select Supplier",
    partyKey: "supplier",
    showSalesPerson: false,
    showPriceList: true,
    showReceiptNumber: true,
    notesLabel: "Order Note",
    notesPlaceholder: "Order Note",
    showPayment: true,
    purchaseApiKey: "directBills",
    purchaseDocType: "direct_bill",
  },
  "/en/purchase/direct-purchase-details": {
    type: "special",
    special: "txn-details",
    title: "Direct Purchase Details",
    module: "Purchase",
    backHref: "/en/purchase/direct-purchases",
    editHref: "/en/purchase/direct-purchase-create",
    txnType: "Direct Purchase",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "directBills",
  },
  "/en/purchase/requisition-details": {
    type: "special",
    special: "txn-details",
    title: "Requisition Details",
    module: "Purchase",
    backHref: "/en/purchase/requisitions",
    editHref: "/en/purchase/requisition-create",
    txnType: "Requisition",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "requisitions",
  },
  "/en/purchase/order-details": {
    type: "special",
    special: "txn-details",
    title: "Purchase Order Details",
    module: "Purchase",
    backHref: "/en/purchase/orders",
    editHref: "/en/purchase/order-create",
    txnType: "Purchase Order",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "orders",
  },
  "/en/purchase/receipt-details": {
    type: "special",
    special: "txn-details",
    title: "Receipt Details",
    module: "Purchase",
    backHref: "/en/purchase/receipts",
    txnType: "Receipt",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "receipts",
  },
  "/en/purchase/bill-details": {
    type: "special",
    special: "txn-details",
    title: "Bill Details",
    module: "Purchase",
    backHref: "/en/purchase/bills",
    txnType: "Bill",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "bills",
  },
  "/en/purchase/return-details": {
    type: "special",
    special: "txn-details",
    title: "Return Details",
    module: "Purchase",
    backHref: "/en/purchase/returns",
    txnType: "Purchase Return",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "returns",
  },
  "/en/purchase/batch-payment-details": {
    type: "special",
    special: "txn-details",
    title: "Batch Payment Details",
    module: "Purchase",
    backHref: "/en/purchase/batch-payments",
    txnType: "Batch Payment",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "batchPayments",
  },
  "/en/purchase/payment-details": {
    type: "special",
    special: "txn-details",
    title: "Payment Details",
    module: "Purchase",
    backHref: "/en/purchase/payments",
    txnType: "Purchase Payment",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "payments",
  },
  "/en/purchase/supplier-credit-details": {
    type: "special",
    special: "txn-details",
    title: "Supplier Credit Details",
    module: "Purchase",
    backHref: "/en/purchase/supplier-credits",
    editHref: "/en/purchase/supplier-credit-create",
    txnType: "Supplier Credit",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "supplierCredits",
  },
  "/en/purchase/refund-details": {
    type: "special",
    special: "txn-details",
    title: "Refund Details",
    module: "Purchase",
    backHref: "/en/purchase/refunds",
    txnType: "Refund",
    partyLabel: "Order by",
    relatedMode: "purchase",
    purchaseApiKey: "refunds",
  },
  "/en/purchase/order-create": {
    type: "special",
    special: "txn-form",
    title: "Add Order",
    module: "Purchase",
    backHref: "/en/purchase/orders",
    numberLabel: "Order Number",
    dateLabel: "Order Date",
    partyLabel: "Supplier",
    partyPlaceholder: "Select Supplier",
    partyKey: "supplier",
    showSalesPerson: false,
    showPriceList: true,
    showPayment: false,
    notesLabel: "Order Note",
    purchaseApiKey: "orders",
  },
  "/en/purchase/supplier-credit-create": {
    type: "special",
    special: "txn-form",
    title: "Add Supplier Credit",
    module: "Purchase",
    backHref: "/en/purchase/supplier-credits",
    numberLabel: "Credit Number",
    dateLabel: "Date",
    partyLabel: "Supplier",
    partyPlaceholder: "Select Supplier",
    partyKey: "supplier",
    showSalesPerson: false,
    showPriceList: false,
    showPayment: false,
    purchaseApiKey: "supplierCredits",
  },
  "/en/cms/orders": {
    type: "list",
    title: "Online Orders",
    module: "CMS",
    columns: cols("ORDER NO", "CUSTOMER", "DATE", "TOTAL", "CHANNEL"),
    rows: mockRows(cols("ORDER NO", "CUSTOMER", "DATE", "TOTAL", "CHANNEL"), 15),
  },
  "/en/accounting/journal-create": {
    type: "special",
    special: "accounting-form",
    accountingForm: "journal",
    title: "Create Journal",
    module: "Accounting",
    backHref: "/en/accounting/journals",
  },
  "/en/accounting/journal-details": {
    type: "special",
    special: "accounting-details",
    accountingDetails: "journal",
    title: "Journal Entry",
    module: "Accounting",
    backHref: "/en/accounting/journals",
    editHref: "/en/accounting/journal-create",
  },
  "/en/accounting/expense-create": {
    type: "special",
    special: "accounting-form",
    accountingForm: "expense",
    title: "Add Expense",
    module: "Accounting",
    backHref: "/en/accounting/expenses",
  },
  "/en/accounting/expense-details": {
    type: "special",
    special: "accounting-details",
    accountingDetails: "expense",
    title: "Expense Details",
    module: "Accounting",
    backHref: "/en/accounting/expenses",
    editHref: "/en/accounting/expense-create",
  },
  "/en/accounting/income-create": {
    type: "special",
    special: "accounting-form",
    accountingForm: "income",
    title: "Add Income",
    module: "Accounting",
    backHref: "/en/accounting/incomes",
  },
  "/en/accounting/income-details": {
    type: "special",
    special: "accounting-details",
    accountingDetails: "income",
    title: "Income Details",
    module: "Accounting",
    backHref: "/en/accounting/incomes",
    editHref: "/en/accounting/income-create",
  },
  "/en/accounting/transfer-create": {
    type: "special",
    special: "accounting-form",
    accountingForm: "transfer",
    title: "Add Transfer",
    module: "Accounting",
    backHref: "/en/accounting/transfer-money",
  },
  "/en/accounting/transfer-details": {
    type: "special",
    special: "accounting-details",
    accountingDetails: "transfer",
    title: "Transfer Details",
    module: "Accounting",
    backHref: "/en/accounting/transfer-money",
    editHref: "/en/accounting/transfer-create",
  },
  "/en/accounting/recurring-journal-create": {
    type: "special",
    special: "accounting-form",
    accountingForm: "recurring",
    title: "Add Recurring Journal",
    module: "Accounting",
    backHref: "/en/accounting/recurring-journal",
  },
  "/en/accounting/recurring-journal-details": {
    type: "special",
    special: "accounting-details",
    accountingDetails: "recurring",
    title: "Recurring Journal Details",
    module: "Accounting",
    backHref: "/en/accounting/recurring-journal",
    editHref: "/en/accounting/recurring-journal-create",
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
  const map = { ...FORM_ROUTES, ...SETTINGS_PAGE_CONFIGS };

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
    map["/en/item-config/items"].addHref = "/en/item-config/add-item";
    map["/en/item-config/items"].addLabel = "Add Single Item";
  }

  // Inventory live polish (Biznify parity)
  const inventoryDateFilters = [
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
  const warehouseFilter = {
    key: "warehouse",
    label: "Warehouses",
    placeholder: "Warehouses",
    optionsFrom: "warehouses",
  };
  const statusTxnFilter = {
    key: "status",
    label: "Status",
    type: "multiselect",
    placeholder: "Status",
    options: ["Approved", "Draft", "Requested", "Initiated", "Received", "Cancelled"],
    defaultValue: ["Approved", "Draft", "Requested", "Initiated"],
  };

  if (map["/en/inventory/item-stock"]) {
    map["/en/inventory/item-stock"].module = "Inventory";
    map["/en/inventory/item-stock"].title = "Item Stock Summary";
    map["/en/inventory/item-stock"].addLabel = "";
    map["/en/inventory/item-stock"].hideFilterToggle = true;
    map["/en/inventory/item-stock"].columns = [
      { key: "item", label: "ITEM", type: "link" },
      { key: "code", label: "CODE" },
      { key: "group", label: "GROUP" },
      { key: "brand", label: "BRAND" },
      { key: "available_stock", label: "AVAILABLE STOCK" },
      { key: "low_stock", label: "LOW STOCK" },
      statusCol,
    ];
    map["/en/inventory/item-stock"].filters = [
      {
        key: "category",
        label: "Categories",
        placeholder: "Select Item Categories",
        optionsFrom: "itemCategories",
      },
      {
        key: "manufacturer",
        label: "Manufacturer",
        placeholder: "Select Item Manufacturer",
        optionsFrom: "manufacturers",
      },
      {
        key: "brand",
        label: "Brand",
        placeholder: "Select Item Brand",
        optionsFrom: "brands",
      },
      warehouseFilter,
      {
        key: "status",
        label: "Status",
        type: "multiselect",
        placeholder: "Status",
        options: ["Active", "Inactive"],
        defaultValue: ["Active"],
      },
      {
        key: "available_only",
        label: "Show Available Stock Items Only",
        type: "checkbox",
      },
    ];
  }
  if (map["/en/inventory/stock-adjustments"]) {
    map["/en/inventory/stock-adjustments"].module = "Inventory";
    map["/en/inventory/stock-adjustments"].title = "Stock Adjustments";
    map["/en/inventory/stock-adjustments"].addHref =
      "/en/inventory/add-stock-adjustment";
    map["/en/inventory/stock-adjustments"].addLabel = "Add New";
    map["/en/inventory/stock-adjustments"].hideFilterToggle = true;
    map["/en/inventory/stock-adjustments"].columns = [
      { key: "adjustment_number", label: "ADJUSTMENT NUMBER", type: "link" },
      { key: "date", label: "DATE" },
      { key: "adjustment_reason", label: "ADJUSTMENT REASON" },
      { key: "warehouse", label: "WAREHOUSE" },
      { key: "adjustment_type", label: "ADJUSTMENT TYPE" },
      statusCol,
      actionCol,
    ];
    map["/en/inventory/stock-adjustments"].filters = [
      {
        key: "warehouse",
        label: "Select Warehouse",
        placeholder: "Select Warehouse",
        optionsFrom: "warehouses",
      },
      {
        key: "status",
        label: "Status",
        type: "multiselect",
        placeholder: "Status",
        options: ["Approved", "Draft", "Cancelled"],
        defaultValue: ["Approved", "Draft"],
      },
      {
        key: "adjustment_reason",
        label: "Adjustment Reason",
        placeholder: "Adjustment Reason",
        optionsFrom: "adjustmentReasons",
      },
      {
        key: "range",
        label: "Select Date Range",
        placeholder: "Select Date Range",
        options: inventoryDateFilters[0].options,
      },
      { key: "from", label: "From Date", type: "date", placeholder: "From Date" },
      { key: "to", label: "To Date", type: "date", placeholder: "To Date" },
    ];
  }
  if (map["/en/inventory/warehouse-transfer-list"]) {
    map["/en/inventory/warehouse-transfer-list"].module = "Inventory";
    map["/en/inventory/warehouse-transfer-list"].title = "Stock Movement";
    map["/en/inventory/warehouse-transfer-list"].addHref =
      "/en/inventory/warehouse-transfer";
    map["/en/inventory/warehouse-transfer-list"].addLabel = "Add New";
    map["/en/inventory/warehouse-transfer-list"].secondaryAddLabel = "Add Request";
    map["/en/inventory/warehouse-transfer-list"].secondaryAddHref =
      "/en/inventory/warehouse-transfer-request-create";
    map["/en/inventory/warehouse-transfer-list"].hideFilterToggle = true;
    map["/en/inventory/warehouse-transfer-list"].columns = [
      { key: "transfer_number", label: "TRANSFER NUMBER", type: "link" },
      { key: "transfer_date", label: "TRANSFER DATE" },
      { key: "source_warehouse", label: "SOURCE WAREHOUSE" },
      { key: "destination_warehouse", label: "DESTINATION WAREHOUSE" },
      statusCol,
      actionCol,
    ];
    map["/en/inventory/warehouse-transfer-list"].filters = [
      warehouseFilter,
      statusTxnFilter,
      ...inventoryDateFilters,
    ];
  }
  if (map["/en/inventory/receive-stock"]) {
    map["/en/inventory/receive-stock"].module = "Inventory";
    map["/en/inventory/receive-stock"].title = "Receivable Stock";
    map["/en/inventory/receive-stock"].addLabel = "";
    map["/en/inventory/receive-stock"].hideFilterToggle = true;
    map["/en/inventory/receive-stock"].columns = [
      { key: "transfer_number", label: "TRANSFER NUMBER", type: "link" },
      { key: "transfer_date", label: "TRANSFER DATE" },
      { key: "source_warehouse", label: "SOURCE WAREHOUSE" },
      { key: "destination_warehouse", label: "DESTINATION WAREHOUSE" },
      statusCol,
      actionCol,
    ];
    map["/en/inventory/receive-stock"].filters = [
      warehouseFilter,
      ...inventoryDateFilters,
    ];
  }
  map["/en/inventory/warehouse-access"] = {
    type: "special",
    special: "warehouse-access",
    title: "Warehouse Access",
    module: "Inventory",
  };

  if (map["/en/pos/outlets"]) {
    map["/en/pos/outlets"].addHref = "/en/pos/outlet-create";
    map["/en/pos/outlets"].addLabel = "Add Outlet";
    map["/en/pos/outlets"].hideFilterToggle = true;
    map["/en/pos/outlets"].title = "POS Outlets";
  }
  if (map["/en/hrm/employee/employees"]) {
    map["/en/hrm/employee/employees"].addHref = "/en/hrm/employee/employee-create";
    map["/en/hrm/employee/employees"].addLabel = "Add Employee";
    map["/en/hrm/employee/employees"].hideFilterToggle = true;
    map["/en/hrm/employee/employees"].title = "Employees";
    map["/en/hrm/employee/employees"].module = "HRM";
    map["/en/hrm/employee/employees"].filters = [
      {
        key: "select_employee_type",
        label: "Select Employee Type",
        placeholder: "Select Employee Type",
        options: ["Full Time", "Part Time", "Contract", "Intern"],
      },
      {
        key: "select_department",
        label: "Select Department",
        placeholder: "Select Department",
        options: [
          "Sales",
          "Digital Marketing",
          "Accounts",
          "HR",
          "Development",
          "Support",
          "Operations",
        ],
      },
      {
        key: "select_employment_status",
        label: "Select Employment Status",
        placeholder: "Select Employment Status",
        options: ["Active", "Inactive"],
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
    map["/en/hrm/employee/employees"].columns = [
      { key: "_check", label: "", type: "checkbox" },
      { key: "code", label: "CODE", type: "link" },
      { key: "name", label: "NAME" },
      { key: "department", label: "DEPARTMENT" },
      { key: "position", label: "POSITION" },
      { key: "employment_type", label: "EMPLOYMENT TYPE" },
      { key: "email", label: "EMAIL" },
      { key: "phone_number", label: "PHONE NUMBER" },
      { key: "joining_date", label: "JOINING DATE" },
      statusCol,
      actionCol,
    ];
    map["/en/hrm/employee/employees"].rows = buildEmployeeRows(25);
    map["/en/hrm/employee/employees"].totalEntries = 73;
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
  if (map["/en/purchase/direct-purchases"]) {
    map["/en/purchase/direct-purchases"].addHref = "/en/purchase/direct-purchase-create";
    map["/en/purchase/direct-purchases"].addLabel = "Add Direct Bill";
    map["/en/purchase/direct-purchases"].summaryCards = [
      {
        key: "sub_total",
        label: "Sub Total Amount",
        value: "৳ 22,965,734,295.57",
        tone: "blue",
        icon: "work_outline",
      },
      {
        key: "total_tax",
        label: "Total Tax Amount",
        value: "৳ 35,828",
        tone: "pink",
        icon: "monitor_heart",
      },
      {
        key: "total_discount",
        label: "Total Discount Amount",
        value: "৳ 30,088.7",
        tone: "green",
        icon: "percent",
      },
      {
        key: "grand_total",
        label: "Grand Total Amount",
        value: "৳ 22,965,835,738.87",
        tone: "purple",
        icon: "add",
      },
    ];
    const supplierFilter = {
      key: "supplier",
      label: "Select Supplier",
      placeholder: "Select Supplier",
      options: ["Rahim", "Karim Traders", "Bestu Store", "hbehb", "Masud Rahman"],
    };
    map["/en/purchase/direct-purchases"].filters = (
      map["/en/purchase/direct-purchases"].filters || []
    ).map((f) => {
      if (f.key === "supplier") return { ...f, ...supplierFilter };
      if (f.key === "status") {
        return {
          ...f,
          placeholder: "Status",
          options: ["Completed", "Cancelled", "Draft", "Pending", "Approved"],
        };
      }
      return f;
    });
    if (!map["/en/purchase/direct-purchases"].filters.some((f) => f.key === "supplier")) {
      map["/en/purchase/direct-purchases"].filters = [
        supplierFilter,
        ...map["/en/purchase/direct-purchases"].filters,
      ];
    }
    const cols = map["/en/purchase/direct-purchases"].columns || [];
    map["/en/purchase/direct-purchases"].columns = cols.map((c) => {
      if (c.key === "supplier" && !c.type) return { ...c, type: "link" };
      return c;
    });
  }
  if (map["/en/purchase/requisitions"]) {
    map["/en/purchase/requisitions"].addHref = "/en/purchase/requisition-create";
    map["/en/purchase/requisitions"].addLabel = "Add Requisition";
  }
  if (map["/en/purchase/orders"]) {
    map["/en/purchase/orders"].addHref = "/en/purchase/order-create";
    map["/en/purchase/orders"].addLabel = "Add Order";
  }
  if (map["/en/purchase/supplier-credits"]) {
    map["/en/purchase/supplier-credits"].addHref = "/en/purchase/supplier-credit-create";
    map["/en/purchase/supplier-credits"].addLabel = "Add Supplier Credit";
  }
  if (map["/en/purchase/supplier-types"]) {
    map["/en/purchase/supplier-types"].addLabel = "Add Supplier Type";
  }
  if (map["/en/sales/customers"]) {
    map["/en/sales/customers"].addHref = "/en/sales/customer-create";
    map["/en/sales/customers"].addLabel = "Add Customer";
    map["/en/sales/customers"].hideFilterToggle = true;
    map["/en/sales/customers"].filters = [
      { key: "type", label: "Customer Types", placeholder: "ex: VIP, Retailer" },
      { key: "status", label: "Status", placeholder: "ex: Active, Inactive" },
      { key: "alsoSupplier", label: "Also Supplier", placeholder: "ex: Yes, No" },
    ];
    map["/en/sales/customers"].columns = [
      { key: "_check", label: "", type: "checkbox" },
      { key: "name", label: "NAME", type: "link", showIcon: true },
      { key: "phone_number", label: "PHONE NUMBER" },
      { key: "email", label: "EMAIL" },
      { key: "customer_since", label: "CUSTOMER SINCE" },
      { key: "customer_code", label: "CUSTOMER CODE" },
      { key: "customer_type", label: "CUSTOMER TYPE" },
      statusCol,
      actionCol,
    ];
    const customerNames = [
      "Dalim Hossain",
      "MD IMRAN Hossain",
      "Ekramul Hoque",
      "Nabil Rahman",
      "Ariful Islam",
      "Mainul Islam",
      "Fatema Akter",
      "Karim Traders",
      "Bestu Store",
      "Walk in Customer",
    ];
    map["/en/sales/customers"].rows = Array.from({ length: 25 }, (_, i) => ({
      id: i === 0 ? 194297 : i + 1,
      name: customerNames[i % customerNames.length],
      phone_number: i === 0 ? "01733112669" : `017${String(10000000 + i * 137).slice(0, 8)}`,
      email: i % 4 === 0 ? "N/A" : `customer${i + 1}@mail.com`,
      customer_since: i === 0 ? "13 Sep 2026" : `${(i % 28) + 1} Aug 2026`,
      customer_code: i === 0 ? "CMID-2026-000085" : `CMID-2026-${String(84 - i).padStart(6, "0")}`,
      customer_type: ["Service Point", "VIP", "Online", "Wholesale V", "N/A"][i % 5],
      status: i % 9 === 0 && i !== 0 ? "Inactive" : "Active",
    }));
    map["/en/sales/customers"].totalEntries = 3372;
  }
  if (map["/en/sales/customer-types"]) {
    map["/en/sales/customer-types"].addLabel = "Add";
    map["/en/sales/customer-types"].hideFilterToggle = true;
  }
  if (map["/en/settings/email-templates"]) {
    map["/en/settings/email-templates"].addLabel = "Add Template";
    map["/en/settings/email-templates"].hideFilterToggle = true;
    map["/en/settings/email-templates"].module = "Configuration";
    map["/en/settings/email-templates"].apiEndpoint = "/settings/email-templates";
    map["/en/settings/email-templates"].columns = [
      { key: "name", label: "NAME", type: "link" },
      { key: "type", label: "TYPE" },
      statusCol,
      actionCol,
    ];
    map["/en/settings/email-templates"].rows = [];
    map["/en/settings/email-templates"].totalEntries = 0;
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
        key: "total_tax",
        label: "Total Tax Amount",
        value: "৳ 389,046.38",
        tone: "pink",
        icon: "monitor_heart",
      },
      {
        key: "total_discount",
        label: "Total Discount Amount",
        value: "৳ 37,343.56",
        tone: "green",
        icon: "percent",
      },
      {
        key: "grand_total",
        label: "Grand Total Amount",
        value: "৳ 40,768,249.25",
        tone: "purple",
        icon: "add",
      },
    ];
    const customerFilter = {
      key: "customer",
      label: "Select Customer",
      placeholder: "Select Customer",
      options: [
        "Walk in Customer.",
        "Dalim Hossain",
        "karim saheb",
        "Rahim",
        "Masud Rahman",
      ],
    };
    map["/en/sales/sales-direct-sales"].filters = (
      map["/en/sales/sales-direct-sales"].filters || []
    ).map((f) => {
      if (f.key === "customer") return { ...f, ...customerFilter };
      if (f.key === "status") {
        return {
          ...f,
          placeholder: "Status",
          options: ["Completed", "Cancelled", "Draft", "Pending"],
        };
      }
      return f;
    });
    if (!map["/en/sales/sales-direct-sales"].filters.some((f) => f.key === "customer")) {
      map["/en/sales/sales-direct-sales"].filters = [
        customerFilter,
        ...map["/en/sales/sales-direct-sales"].filters,
      ];
    }
    const cols = map["/en/sales/sales-direct-sales"].columns || [];
    map["/en/sales/sales-direct-sales"].columns = cols.map((c) => {
      if (c.key === "customer" && !c.type) return { ...c, type: "link" };
      return c;
    });
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
  if (map["/en/support-tickets"]) {
    map["/en/support-tickets"].addHref = "/en/support-tickets/create";
    map["/en/support-tickets"].addLabel = "Create Support Ticket";
    map["/en/support-tickets"].title = "Support & Tickets";
    // Ensure ACTION column exists for Details menu
    const cols = map["/en/support-tickets"].columns || [];
    if (!cols.some((c) => c.type === "action")) {
      map["/en/support-tickets"].columns = [...cols, actionCol];
    }
  }
  if (map["/en/acl/role/index"]) {
    map["/en/acl/role/index"].addHref = "/en/acl/role/create";
    map["/en/acl/role/index"].addLabel = "Create Role";
    map["/en/acl/role/index"].title = "Roles";
    map["/en/acl/role/index"].hideFilterToggle = true;
    map["/en/acl/role/index"].apiEndpoint = "/acl/roles";
    map["/en/acl/role/index"].columns = OVERRIDES["/en/acl/role/index"].columns;
  }
  if (map["/en/acl/user/index"]) {
    map["/en/acl/user/index"].addHref = "/en/acl/user/invite";
    map["/en/acl/user/index"].addLabel = "Invite an User";
    map["/en/acl/user/index"].title = "Users";
    map["/en/acl/user/index"].hideFilterToggle = true;
    map["/en/acl/user/index"].apiEndpoint = "/acl/users";
    map["/en/acl/user/index"].columns = OVERRIDES["/en/acl/user/index"].columns;
  }
  // Pages with no create CTA on live
  for (const href of [
    "/en/sales/sales-deliveries",
    "/en/sales/sales-invoices",
    "/en/sales/sales-returns",
    "/en/sales/batch-payments",
    "/en/sales/sales-payments",
    "/en/sales/refunds",
    "/en/purchase/receipts",
    "/en/purchase/bills",
    "/en/purchase/returns",
    "/en/purchase/batch-payments",
    "/en/purchase/payments",
    "/en/purchase/refunds",
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
  if (map["/en/accounting/journals"]) {
    map["/en/accounting/journals"].addHref = "/en/accounting/journal-create";
  }
  if (map["/en/accounting/expenses"]) {
    map["/en/accounting/expenses"].addHref = "/en/accounting/expense-create";
  }
  if (map["/en/accounting/incomes"]) {
    map["/en/accounting/incomes"].addHref = "/en/accounting/income-create";
  }
  if (map["/en/accounting/transfer-money"]) {
    map["/en/accounting/transfer-money"].addHref = "/en/accounting/transfer-create";
  }
  if (map["/en/accounting/recurring-journal"]) {
    map["/en/accounting/recurring-journal"].addHref = "/en/accounting/recurring-journal-create";
  }

  // Inventory list pages load from /inventory/* API
  const inventoryApis = {
    "/en/inventory/item-stock": "/inventory/item-stock",
    "/en/inventory/stock-adjustments": "/inventory/stock-adjustments",
    "/en/inventory/warehouse-transfer-list": "/inventory/warehouse-transfers",
    "/en/inventory/receive-stock": "/inventory/receivable-stock",
  };
  for (const [href, endpoint] of Object.entries(inventoryApis)) {
    if (map[href]) {
      map[href].apiEndpoint = endpoint;
      map[href].module = "Inventory";
      map[href].rows = [];
    }
  }

  // Sales list pages load from /sales/* API
  const salesApis = {
    "/en/sales/sales-direct-sales": "/sales/direct-invoices",
    "/en/sales/quotation-list": "/sales/quotations",
    "/en/sales/sales-orders": "/sales/orders",
    "/en/sales/sales-deliveries": "/sales/deliveries",
    "/en/sales/sales-invoices": "/sales/invoices",
    "/en/sales/sales-returns": "/sales/returns",
    "/en/sales/batch-payments": "/sales/batch-payments",
    "/en/sales/sales-payments": "/sales/payments",
    "/en/sales/customer-debits": "/sales/customer-debits",
    "/en/sales/refunds": "/sales/refunds",
  };
  for (const [href, endpoint] of Object.entries(salesApis)) {
    if (map[href]) {
      map[href].apiEndpoint = endpoint;
      map[href].module = "Sales";
      map[href].rows = [];
      map[href].totalEntries = 0;
      if (map[href].summaryCards?.length) {
        map[href].summaryCards = map[href].summaryCards.map((c) => ({
          ...c,
          value: c.value != null ? "৳ 0" : c.value,
        }));
      }
    }
  }

  // Purchase list pages load from /purchase/* API
  const purchaseApis = {
    "/en/purchase/direct-purchases": "/purchase/direct-bills",
    "/en/purchase/requisitions": "/purchase/requisitions",
    "/en/purchase/orders": "/purchase/orders",
    "/en/purchase/receipts": "/purchase/receipts",
    "/en/purchase/bills": "/purchase/bills",
    "/en/purchase/returns": "/purchase/returns",
    "/en/purchase/batch-payments": "/purchase/batch-payments",
    "/en/purchase/payments": "/purchase/payments",
    "/en/purchase/supplier-credits": "/purchase/supplier-credits",
    "/en/purchase/refunds": "/purchase/refunds",
  };
  for (const [href, endpoint] of Object.entries(purchaseApis)) {
    if (map[href]) {
      map[href].apiEndpoint = endpoint;
      map[href].module = "Purchase";
      map[href].rows = [];
      map[href].totalEntries = 0;
      if (map[href].summaryCards?.length) {
        map[href].summaryCards = map[href].summaryCards.map((c) => ({
          ...c,
          value: c.value != null ? "৳ 0" : c.value,
        }));
      }
    }
  }

  Object.assign(map, SETTINGS_PAGE_CONFIGS);

  // Master-data list pages load from /master/* API
  const masterApis = {
    "/en/item-config/items": "/master/items",
    "/en/item-config/manufacturers": "/master/manufacturers",
    "/en/item-config/brands": "/master/brands",
    "/en/item-config/colors": "/master/colors",
    "/en/item-config/item-sizes": "/master/size-types",
    "/en/item-config/item-attributes": "/master/attribute-sets",
    "/en/item-config/price-list": "/master/price-lists",
    "/en/sales/customer-types": "/master/customer-types",
    "/en/sales/customers": "/master/customers",
    "/en/purchase/supplier-types": "/master/supplier-types",
    "/en/purchase/suppliers": "/master/suppliers",
    "/en/inventory/warehouses": "/master/warehouses",
    "/en/pos/outlets": "/master/outlets",
  };
  for (const [href, endpoint] of Object.entries(masterApis)) {
    if (map[href]) {
      map[href].apiEndpoint = endpoint;
      map[href].rows = [];
    }
  }
  if (map["/en/sales/customer-create"]) {
    map["/en/sales/customer-create"].apiEndpoint = "/master/customers";
  }
  if (map["/en/sales/customer-update"]) {
    map["/en/sales/customer-update"].apiEndpoint = "/master/customers";
  }
  if (map["/en/purchase/supplier-create"]) {
    map["/en/purchase/supplier-create"].apiEndpoint = "/master/suppliers";
  }

  // Settings list pages load from /settings/* API
  const settingsApis = {
    "/en/tax/tax-list": "/settings/taxes",
    "/en/discount/discount-list": "/settings/discounts",
    "/en/settings/payment-methods": "/settings/payment-methods",
    "/en/settings/delivery-charges": "/settings/delivery-charges",
    "/en/inventory/adjustment-reasons": "/settings/adjustment-reasons",
    "/en/settings/custom-fields": "/settings/custom-fields",
    "/en/settings/email-templates": "/settings/email-templates",
    "/en/sms/sms-templates": "/settings/sms-templates",
  };
  for (const [href, endpoint] of Object.entries(settingsApis)) {
    if (map[href]) {
      map[href].apiEndpoint = endpoint;
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
  const salesDetailsBases = [
    "/en/sales/sales-direct-sale-details",
    "/en/sales/quotation-details",
    "/en/sales/sales-order-details",
    "/en/sales/sales-delivery-details",
    "/en/sales/sales-invoice-details",
    "/en/sales/sales-return-details",
    "/en/sales/batch-payment-details",
    "/en/sales/sales-payment-details",
    "/en/sales/customer-debit-details",
    "/en/sales/refund-details",
  ];
  for (const base of salesDetailsBases) {
    if (pathname.startsWith(base)) {
      return PAGE_CONFIGS[base] || null;
    }
  }
  const purchaseDetailsBases = [
    "/en/purchase/direct-purchase-details",
    "/en/purchase/requisition-details",
    "/en/purchase/order-details",
    "/en/purchase/receipt-details",
    "/en/purchase/bill-details",
    "/en/purchase/return-details",
    "/en/purchase/batch-payment-details",
    "/en/purchase/payment-details",
    "/en/purchase/supplier-credit-details",
    "/en/purchase/refund-details",
  ];
  for (const base of purchaseDetailsBases) {
    if (pathname.startsWith(base)) {
      return PAGE_CONFIGS[base] || null;
    }
  }
  if (pathname.startsWith("/en/sales/customer-update")) {
    return PAGE_CONFIGS["/en/sales/customer-update"] || null;
  }
  if (pathname.startsWith("/en/sales/customer-details")) {
    return PAGE_CONFIGS["/en/sales/customer-details"] || null;
  }
  if (pathname.startsWith("/en/support-tickets/details")) {
    return PAGE_CONFIGS["/en/support-tickets/details"] || null;
  }
  if (pathname.startsWith("/en/acl/role/role-details")) {
    return PAGE_CONFIGS["/en/acl/role/role-details"] || null;
  }
  if (pathname.startsWith("/en/acl/user/user-details")) {
    return PAGE_CONFIGS["/en/acl/user/user-details"] || null;
  }
  if (pathname.startsWith("/en/inventory/stock-adjustment-details")) {
    return PAGE_CONFIGS["/en/inventory/stock-adjustment-details"] || null;
  }
  if (pathname.startsWith("/en/inventory/warehouse-transfer-details")) {
    return PAGE_CONFIGS["/en/inventory/warehouse-transfer-details"] || null;
  }
  if (pathname.startsWith("/en/inventory/receive-stock-create")) {
    return PAGE_CONFIGS["/en/inventory/receive-stock-create"] || null;
  }
  if (pathname.startsWith("/en/inventory/warehouse-transfer-initiate")) {
    return PAGE_CONFIGS["/en/inventory/warehouse-transfer-initiate"] || null;
  }
  if (pathname.startsWith("/en/item-config/item-details")) {
    return PAGE_CONFIGS["/en/item-config/item-details"] || null;
  }
  if (pathname.startsWith("/en/hrm/employee/employee-update")) {
    return PAGE_CONFIGS["/en/hrm/employee/employee-update"] || null;
  }
  if (pathname.startsWith("/en/hrm/employee/employee-details")) {
    return PAGE_CONFIGS["/en/hrm/employee/employee-details"] || null;
  }

  if (pathname.startsWith("/en/manufacturing/production-plan-update")) {
    return PAGE_CONFIGS["/en/manufacturing/production-plan-update"] || null;
  }
  if (pathname.startsWith("/en/manufacturing/production-plan-details")) {
    return PAGE_CONFIGS["/en/manufacturing/production-plan-details"] || null;
  }
  if (pathname.startsWith("/en/manufacturing/production-plan-template-details")) {
    return PAGE_CONFIGS["/en/manufacturing/production-plan-template-details"] || null;
  }
  if (pathname.startsWith("/en/manufacturing/item-pipeline")) {
    return PAGE_CONFIGS["/en/manufacturing/item-pipeline"] || null;
  }
  if (pathname.startsWith("/en/manufacturing/finished-goods-details")) {
    return PAGE_CONFIGS["/en/manufacturing/finished-goods-details"] || null;
  }
  if (pathname.startsWith("/en/manufacturing/waste-goods-details")) {
    return PAGE_CONFIGS["/en/manufacturing/waste-goods-details"] || null;
  }

  return null;
}

export function allPagePaths() {
  return Object.keys(PAGE_CONFIGS);
}
