/** Full sidebar tree mirrored from live app.biznify.net */

export const DASHBOARD_NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    href: "/en/dashboard",
    children: [
      { id: "business", label: "Business", href: "/en/dashboard", icon: "business" },
      { id: "accounting-dash", label: "Accounting", href: "/en/accounting/dashboard", icon: "account_balance" },
    ],
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: "account_balance_wallet",
    children: [
      { id: "coa", label: "Chart Of Account", href: "/en/accounting/accounts", icon: "account_tree" },
      {
        id: "transaction",
        label: "Transaction",
        icon: "swap_horiz",
        children: [
          { id: "journals", label: "Journals", href: "/en/accounting/journals", badge: 6 },
          { id: "expenses", label: "Expenses", href: "/en/accounting/expenses", badge: 17 },
          { id: "incomes", label: "Incomes", href: "/en/accounting/incomes", badge: 5 },
          { id: "transfer", label: "Internal Transfer", href: "/en/accounting/transfer-money", badge: 1 },
          { id: "recurring", label: "Recurring Journals", href: "/en/accounting/recurring-journal" },
        ],
      },
    ],
  },
  {
    id: "item",
    label: "Item",
    icon: "inventory_2",
    children: [
      { id: "item-cat", label: "Category", href: "/en/item-config/item-categories" },
      { id: "items", label: "Items", href: "/en/item-config/items" },
      { id: "manufacturer", label: "Manufacturer", href: "/en/item-config/manufacturers" },
      { id: "brand", label: "Brand", href: "/en/item-config/brands" },
      { id: "price-list", label: "Price List", href: "/en/item-config/price-list" },
      { id: "color", label: "Color", href: "/en/item-config/colors" },
      { id: "size", label: "Size Type", href: "/en/item-config/item-sizes" },
      { id: "attr", label: "Attribute Set", href: "/en/item-config/item-attributes" },
    ],
  },
  {
    id: "customer",
    label: "Customer",
    icon: "people",
    children: [
      { id: "cust-type", label: "Customer Type", href: "/en/sales/customer-types" },
      { id: "customers", label: "Customers", href: "/en/sales/customers" },
    ],
  },
  {
    id: "sale",
    label: "Sale",
    icon: "point_of_sale",
    children: [
      { id: "direct-inv", label: "Direct Invoice", href: "/en/sales/sales-direct-sales" },
      { id: "quotation", label: "Quotation", href: "/en/sales/quotation-list" },
      { id: "so", label: "Order", href: "/en/sales/sales-orders" },
      { id: "delivery", label: "Delivery", href: "/en/sales/sales-deliveries" },
      { id: "invoices", label: "All Invoices", href: "/en/sales/sales-invoices" },
      { id: "sale-return", label: "Return", href: "/en/sales/sales-returns" },
      { id: "sale-batch", label: "Batch Payment", href: "/en/sales/batch-payments" },
      { id: "sale-pay", label: "Payment", href: "/en/sales/sales-payments" },
      { id: "cust-debit", label: "Customer Debit", href: "/en/sales/customer-debits" },
      { id: "sale-refund", label: "Refund", href: "/en/sales/refunds" },
    ],
  },
  {
    id: "pos",
    label: "POS",
    icon: "storefront",
    children: [
      { id: "outlet", label: "Outlet", href: "/en/pos/outlets" },
      { id: "outlet-checkin", label: "Outlet Check-in", href: "/en/pos/posoutletcheckin" },
      { id: "counter", label: "Counter", href: "/en/pos-counter/index" },
      { id: "counter-checkin", label: "Counter Check-in", href: "/en/pos/poscountercheckin" },
      { id: "outlet-sess", label: "Outlet Sessions", href: "/en/pos/outlet-sessions" },
      { id: "counter-sess", label: "Counter Sessions", href: "/en/pos/counter-sessions" },
      { id: "pos-orders", label: "Orders", href: "/en/pos/index" },
      { id: "pos-return", label: "Return", href: "/en/pos/pos-returns" },
      { id: "barcode", label: "Barcode", href: "/en/pos/barcodegeneration" },
      { id: "outlet-access", label: "Outlet Access", href: "/en/pos/outlet-access" },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: "precision_manufacturing",
    children: [
      { id: "mfg-overview", label: "Overview", href: "/en/manufacturing/dashboard", type: "special" },
      { id: "prod-plans", label: "Production Plans", href: "/en/manufacturing/production-plans" },
      { id: "mfg-tpl", label: "Templates", href: "/en/manufacturing/production-plan-templates" },
      { id: "pipeline", label: "Production Pipeline", href: "/en/manufacturing/pipelines" },
      { id: "finished", label: "Finished Goods", href: "/en/manufacturing/finished-goods" },
      { id: "waste", label: "Waste Goods", href: "/en/manufacturing/waste-goods" },
      { id: "mfg-settings", label: "Settings", href: "/en/manufacturing/manufacturing-settings" },
    ],
  },
  {
    id: "support",
    label: "Support & Ticketing",
    icon: "support_agent",
    children: [{ id: "tickets", label: "Tickets", href: "/en/support-tickets" }],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "warehouse",
    children: [
      { id: "stock", label: "Item Stock Summary", href: "/en/inventory/item-stock" },
      { id: "adj", label: "Stock Adjustment", href: "/en/inventory/stock-adjustments" },
      { id: "movement", label: "Stock Movement", href: "/en/inventory/warehouse-transfer-list" },
      { id: "recv-stock", label: "Receivable Stock", href: "/en/inventory/receive-stock" },
      { id: "wh-access", label: "Warehouse Access", href: "/en/inventory/warehouse-access" },
    ],
  },
  {
    id: "supplier",
    label: "Supplier",
    icon: "local_shipping",
    children: [
      { id: "sup-type", label: "Supplier Type", href: "/en/purchase/supplier-types" },
      { id: "suppliers", label: "Suppliers", href: "/en/purchase/suppliers" },
    ],
  },
  {
    id: "purchase",
    label: "Purchase",
    icon: "shopping_bag",
    children: [
      { id: "direct-bill", label: "Direct Bill", href: "/en/purchase/direct-purchases" },
      { id: "requisition", label: "Requisition", href: "/en/purchase/requisitions" },
      { id: "po", label: "Order", href: "/en/purchase/orders" },
      { id: "receipt", label: "Receipt", href: "/en/purchase/receipts" },
      { id: "bills", label: "All Bills", href: "/en/purchase/bills" },
      { id: "pur-return", label: "Return", href: "/en/purchase/returns" },
      { id: "pur-batch", label: "Batch Payment", href: "/en/purchase/batch-payments" },
      { id: "pur-pay", label: "Payment", href: "/en/purchase/payments" },
      { id: "sup-credit", label: "Supplier Credit", href: "/en/purchase/supplier-credits" },
      { id: "pur-refund", label: "Refund", href: "/en/purchase/refunds" },
    ],
  },
  {
    id: "hrm",
    label: "HRM",
    icon: "badge",
    children: [
      {
        id: "employee",
        label: "Employee",
        children: [
          { id: "employees", label: "Employees", href: "/en/hrm/employee/employees" },
          {
            id: "emp-setup",
            label: "Setup",
            children: [
              { id: "shifts", label: "Shifts", href: "/en/hrm/employee/working-shifts" },
              { id: "rosters", label: "Rosters", href: "/en/hrm/employee/rosters" },
              { id: "job-titles", label: "Job Titles", href: "/en/hrm/employee/job-titles" },
              { id: "depts", label: "Departments", href: "/en/hrm/employee/organizations" },
              { id: "offices", label: "Office Locations", href: "/en/hrm/employee/office-locations" },
              { id: "emp-types", label: "Employment Types", href: "/en/hrm/employee/employment-types" },
            ],
          },
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        children: [
          { id: "ot", label: "OT Requests", href: "/en/hrm/attendance/ot-requests" },
          {
            id: "take-att",
            label: "Take Attendance",
            href: "/en/hrm/attendance/attendance-sheet",
            type: "special",
          },
        ],
      },
      {
        id: "payroll",
        label: "Payroll",
        children: [
          {
            id: "pay-setup",
            label: "Setup",
            children: [
              { id: "payhead", label: "Pay Head", href: "/en/hrm/payroll/payheads" },
              { id: "payrolls", label: "Pay Roll", href: "/en/hrm/payroll/payrolls" },
              { id: "positions", label: "Positions", href: "/en/hrm/payroll/positions" },
            ],
          },
          {
            id: "pay-mgmt",
            label: "Management",
            children: [
              { id: "payslip", label: "Payslip Manager", href: "/en/hrm/payroll/payslip-index" },
              { id: "salary", label: "Salary Sheet", href: "/en/hrm/payroll/salarysheet" },
              { id: "resign-rules", label: "Resign Rules", href: "/en/hrm/payroll/resign-rule-list" },
              { id: "resignation", label: "Resignation", href: "/en/hrm/payroll/resignations" },
              { id: "rejoin", label: "Rejoin", href: "/en/hrm/payroll/rejoin-list" },
            ],
          },
          { id: "billing-periods", label: "Billing Periods", href: "/en/hrm/payroll/billingperiods" },
        ],
      },
      {
        id: "leave",
        label: "Leave",
        children: [
          { id: "leave-types", label: "Leave Types", href: "/en/hrm/leave/leave-types" },
          { id: "assign-leave", label: "Assign Leave Type", href: "/en/hrm/leave/assign-leave-type-list" },
          { id: "leave-apps", label: "Leave Applications", href: "/en/hrm/leave/leave-applications" },
          {
            id: "holiday",
            label: "Holiday",
            children: [{ id: "holidays", label: "Holidays", href: "/en/hrm/holiday/holidays" }],
          },
        ],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: "assessment",
    href: "/en/reports/index",
    type: "special",
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: "settings",
    children: [
      {
        id: "email",
        label: "Email",
        children: [
          { id: "email-tpl", label: "Email Templates", href: "/en/settings/email-templates" },
          { id: "email-cfg", label: "Email Configuration", href: "/en/settings/email-setting" },
        ],
      },
      {
        id: "sms",
        label: "SMS",
        children: [
          { id: "sms-tpl", label: "SMS Templates", href: "/en/sms/sms-templates" },
          { id: "sms-cfg", label: "SMS Configuration", href: "/en/sms/sms-settings" },
        ],
      },
    ],
  },
  {
    id: "acl",
    label: "ACL",
    icon: "admin_panel_settings",
    children: [
      { id: "role", label: "Role", href: "/en/acl/role/index" },
      { id: "user", label: "User", href: "/en/acl/user/index" },
    ],
  },
];

export function flattenNav(nodes = DASHBOARD_NAV, acc = []) {
  for (const n of nodes) {
    if (n.href) acc.push(n);
    if (n.children) flattenNav(n.children, acc);
  }
  return acc;
}
