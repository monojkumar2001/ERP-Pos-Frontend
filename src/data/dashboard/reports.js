export const REPORT_CATEGORIES = [
  {
    id: "sales",
    title: "Sales",
    icon: "shopping_bag",
    items: [
      {
        id: "customer-sales",
        title: "Customer Sales Report",
        description: "This report displays all customer wise sales report",
      },
      {
        id: "customer-wise-item-sales",
        title: "Customer Wise Item Sales",
        description: "This report displays all customer wise item sales report",
      },
      {
        id: "item-wise-sales",
        title: "Item Wise Sales",
        description: "This report displays all item wise sales report",
      },
      {
        id: "customer-ledger",
        title: "Customer Ledger",
        description:
          "This report displays a listing of all transactions for selected customer, within a specified date range.",
      },
      {
        id: "sales-by-salesperson",
        title: "Sales By Sales Person",
        description: "This report helps you to know how much each sales person sales",
      },
      {
        id: "combined-ledger",
        title: "Combined Customer-Supplier Ledger",
        description:
          "This report provides an insight into the transaction activities of the customers who are your suppliers as well",
      },
      {
        id: "user-wise-sales",
        title: "User Wise Sales",
        description: "This report helps you to know how much each user sales.",
      },
      {
        id: "item-wise-customer-sales",
        title: "Item Wise Customer Sales",
        description: "This report displays how mush one item sales by customers",
      },
      {
        id: "delivery-charges",
        title: "Comparison On Delivery Charges",
        description:
          "Provides insights into delivery charge comparisons, helping you make informed decisions.",
      },
      {
        id: "invoice-profit",
        title: "Invoice Wise Profit Report",
        description: "Provides the profit information of every invoice.",
      },
      {
        id: "customer-aging",
        title: "Customer Aging Report",
        description: "This report displays date wise customer's dues.",
      },
      {
        id: "item-profit",
        title: "Item Wise Profit Report",
        description: "Provides the profit information of every items.",
      },
      {
        id: "invoice-update-history",
        title: "Invoice Update History",
        description: "Displays the history of all invoice updates for tracking and review.",
      },
    ],
  },
  {
    id: "purchases",
    title: "Purchases",
    icon: "local_shipping",
    items: [
      {
        id: "supplier-purchase",
        title: "Supplier Purchase Report",
        description: "This report displays all supplier wise purchase report",
      },
      {
        id: "supplier-wise-item-purchase",
        title: "Supplier Wise Item Purchase",
        description: "This report displays all supplier wise item purchase report",
      },
      {
        id: "supplier-ledger",
        title: "Supplier Ledger",
        description:
          "This report displays a listing of all transactions for selected supplier , within a specified Date range.",
      },
      {
        id: "item-wise-purchase",
        title: "Item Wise Purchase Report",
        description: "This report displays all item wise purchase report",
      },
    ],
  },
  {
    id: "accounting",
    title: "Accounting",
    icon: "history",
    items: [
      {
        id: "general-ledger",
        title: "General Ledger",
        description:
          "Represents the record-keeping system for a company’s financial data, with debit and credit account records validated by a trial balance.",
      },
      {
        id: "account-balance",
        title: "Account Balance",
        description:
          "An account balance is a report used to display companys transactions against each account within a specified date range.",
      },
      {
        id: "balance-sheet",
        title: "Balance Sheet",
        description: "This report shows all account balances within a date range",
      },
      {
        id: "profit-and-loss",
        title: "Profit And Loss",
        description: "This report shows profit and loss within a date range",
      },
      {
        id: "trial-balance",
        title: "Trial Balance",
        description:
          "Lists all the accounts holding either a debit balance or a credit balance contained in the ledger of a business within given range.",
      },
      {
        id: "transaction-history",
        title: "Transaction History",
        description:
          "Provides the detailed information in the form of general entry of each transaction in the system.",
      },
      {
        id: "daily-balance-flow",
        title: "Daily Balance Flow Report",
        description: "Provides daily opening and closing balances with transactions.",
      },
      {
        id: "monthly-balance-flow",
        title: "Monthly Balance Flow Report",
        description: "Provides monthly opening and closing balances with transactions.",
      },
      {
        id: "yearly-balance-flow",
        title: "Yearly Balance Flow Report",
        description: "Provides yearly opening and closing balances with transactions.",
      },
    ],
  },
  {
    id: "hrm",
    title: "HRM",
    icon: "badge",
    items: [
      {
        id: "employee-attendance",
        title: "Employee Wise Attendance Report",
        description:
          "Presents a detailed record of employee attendance, tracking days worked, absences, leaves, and late arrivals for each employee.",
      },
      {
        id: "month-attendance",
        title: "Month Wise Attendance Report",
        description:
          "Provides an overview of employee attendance on a month-by-month basis, detailing days worked, absences, and leaves for each month.",
      },
      {
        id: "employee-leave",
        title: "Employee Leave Report",
        description:
          "Offers a detailed summary of employee leave, including the type, duration, and status of leaves taken.",
      },
    ],
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: "apps",
    items: [
      {
        id: "stock-ledger",
        title: "Stock Ledger",
        description:
          "This report displays a listing of all transactions for selected item, within a specified date range.",
      },
      {
        id: "item-stock-summary",
        title: "Item Stock Summary",
        description:
          "This report shows all item's stock availability and low stock point and can also filter",
      },
      {
        id: "warehouse-stock",
        title: "Warehouse Stock Details",
        description: "This report displays item stock details in your warehouse",
      },
      {
        id: "item-stock-location",
        title: "Item Stock Location",
        description: "This report displays item stock location details in all bin and warehouse",
      },
      {
        id: "low-stock",
        title: "Low Stock Details",
        description:
          "It will lists all the products which are short in stock based on minimum stock levels defined against each product.",
      },
      {
        id: "item-stock-valuation",
        title: "Item Stock Valuation",
        description:
          "This report helps user to verify average cost calculation and changes by the period of time.",
      },
      {
        id: "stock-valuation-summary",
        title: "Stock Valuation Summary",
        description: "This report displays item stock valuation summary",
      },
      {
        id: "warehouse-txn-history",
        title: "Warehouse Transaction History",
        description: "Allows you to gain helpful insights about your warehouse transaction history",
      },
      {
        id: "item-serial",
        title: "Item Serial Details",
        description: "This report shows all the serials and status for a specific item",
      },
      {
        id: "batch-wise-stock",
        title: "Batch Wise Stock Report",
        description: "This report displays batch wise stock report",
      },
      {
        id: "expiring-batch",
        title: "Expiring Batch Report",
        description: "This report displays all batches which will expire soon",
      },
      {
        id: "stock-adjustment",
        title: "Stock Adjustment Report",
        description: "This report displays all item stock adjustments.",
      },
      {
        id: "datewise-purchase-sale",
        title: "Datewise Item Purchase Sale Report",
        description:
          "This report displays date-wise item sale and purchase quantities and amounts, with overall summary totals.",
      },
    ],
  },
];

export const DEFAULT_FAVORITE_IDS = [
  "customer-sales",
  "general-ledger",
  "stock-ledger",
  "balance-sheet",
  "profit-and-loss",
  "low-stock",
];

export function allReports() {
  return REPORT_CATEGORIES.flatMap((c) =>
    c.items.map((item) => ({ ...item, categoryId: c.id, categoryTitle: c.title }))
  );
}
