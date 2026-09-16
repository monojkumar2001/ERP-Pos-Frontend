"use client";

import { Suspense } from "react";
import { getPageConfig } from "../../data/dashboard/pageConfigs";
import ListPage from "./ListPage";
import FormPage from "./FormPage";
import PriceListFormPage from "./PriceListFormPage";
import AccountingDashboard from "./AccountingDashboard";
import ChartOfAccountsPage from "./ChartOfAccountsPage";
import AccountingFormPage from "./AccountingFormPage";
import AccountingDetailsPage from "./AccountingDetailsPage";
import ItemCategoriesPage from "./ItemCategoriesPage";
import AddItemPage from "./AddItemPage";
import OutletFormPage from "./OutletFormPage";
import TransactionFormPage from "./TransactionFormPage";
import TransactionDetailsPage from "./TransactionDetailsPage";
import CustomerDetailsPage from "./CustomerDetailsPage";
import SupportTicketFormPage from "./SupportTicketFormPage";
import SupportTicketDetailsPage from "./SupportTicketDetailsPage";
import AclRoleFormPage from "./AclRoleFormPage";
import AclRoleDetailsPage from "./AclRoleDetailsPage";
import AclUserDetailsPage from "./AclUserDetailsPage";
import AclUserInvitePage from "./AclUserInvitePage";
import InventoryDetailsPage from "./InventoryDetailsPage";
import InventoryFormPage from "./InventoryFormPage";
import WarehouseAccessPage from "./WarehouseAccessPage";
import ItemDetailsPage from "./ItemDetailsPage";
import EmployeeFormPage from "./EmployeeFormPage";
import EmployeeDetailsPage from "./EmployeeDetailsPage";
import ReportsPage from "./ReportsPage";
import {
  ManufacturingOverviewPage,
  AttendanceSheetPage,
  BarcodePage,
} from "./SpecialPages";
import SubscriptionsPage from "./SubscriptionsPage";
import SettingsFormPage from "./SettingsFormPage";
import ConfigSettingsPage from "./ConfigSettingsPage";
import {
  BinLocationsPage,
  DeliveryChannelsPage,
  TemplateSettingsPage,
  UomConversionsPage,
} from "./SettingsSpecialPages";

const SPECIAL = {
  reports: ReportsPage,
  manufacturing: ManufacturingOverviewPage,
  attendance: AttendanceSheetPage,
  barcode: BarcodePage,
  subscriptions: SubscriptionsPage,
  "settings-form": SettingsFormPage,
  "config-settings": ConfigSettingsPage,
  "bin-locations": BinLocationsPage,
  "delivery-channels": DeliveryChannelsPage,
  "template-settings": TemplateSettingsPage,
  "uom-conversions": UomConversionsPage,
  "accounting-dash": AccountingDashboard,
  "chart-of-accounts": ChartOfAccountsPage,
  "accounting-form": AccountingFormPage,
  "accounting-details": AccountingDetailsPage,
  "item-categories": ItemCategoriesPage,
  "add-item": AddItemPage,
  "outlet-form": OutletFormPage,
  "txn-form": TransactionFormPage,
  "txn-details": TransactionDetailsPage,
  "customer-details": CustomerDetailsPage,
  "support-ticket-form": SupportTicketFormPage,
  "support-ticket-details": SupportTicketDetailsPage,
  "acl-role-form": AclRoleFormPage,
  "acl-role-details": AclRoleDetailsPage,
  "acl-user-details": AclUserDetailsPage,
  "acl-user-invite": AclUserInvitePage,
  "inventory-details": InventoryDetailsPage,
  "inventory-form": InventoryFormPage,
  "warehouse-access": WarehouseAccessPage,
  "item-details": ItemDetailsPage,
  "employee-form": EmployeeFormPage,
  "employee-details": EmployeeDetailsPage,
};

function aclRoleIdFromPath(pathname) {
  const m = pathname.match(/\/acl\/role\/role-details\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function aclUserIdFromPath(pathname) {
  const m = pathname.match(/\/acl\/user\/user-details\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function inventoryIdFromPath(pathname) {
  const m = pathname.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
}

const DIRECT_SALE_SEED = {
  1: {
    id: 1,
    orderNumber: "DSO-001000",
    date: "6 Sep 2026",
    type: "Direct Sale",
    salesPerson: "Demo",
    status: "Completed",
    customer: "Walk in Customer.",
    customerPhone: "01700000000",
    grandTotal: "৳ 2,300",
    lines: [
      {
        id: 1,
        item: "Paper A4",
        meta: "M: Default, B: Default",
        orderedQty: "10 pc",
        billedQty: "10 pc",
        deliveredQty: "10 pc",
        returnedQty: "0 pc",
        price: "৳ 230",
        discount: "N/A",
        amount: "৳ 2,300",
      },
    ],
    deliveries: [
      {
        number: "DEL-001000",
        date: "6 Sep 2026",
        type: "Store Pickup",
        status: "Delivered",
      },
    ],
    invoices: [
      {
        number: "INV-2026-000001",
        date: "6 Sep 2026",
        paid: "৳ 0",
        due: "৳ 2,300",
        total: "৳ 2,300",
        status: "Unpaid",
      },
    ],
  },
  2: {
    id: 2,
    orderNumber: "DSO-000999",
    date: "3 Sep 2026",
    type: "Direct Sale",
    salesPerson: "Demo",
    status: "Completed",
    customer: "rggfg",
    customerPhone: "01711111111",
    grandTotal: "৳ 1,150",
    lines: [
      {
        id: 1,
        item: "Bag",
        meta: "M: Default, B: Default",
        orderedQty: "5 pc",
        billedQty: "5 pc",
        deliveredQty: "5 pc",
        returnedQty: "0 pc",
        price: "৳ 230",
        discount: "N/A",
        amount: "৳ 1,150",
      },
    ],
    deliveries: [],
    invoices: [
      {
        number: "INV-2026-000002",
        date: "3 Sep 2026",
        paid: "৳ 1,150",
        due: "৳ 0",
        total: "৳ 1,150",
        status: "Paid",
      },
    ],
  },
};

function directSaleIdFromPath(pathname) {
  const m = pathname.match(/\/sales-direct-sale-details\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function salesDocIdFromPath(pathname) {
  const m = pathname.match(
    /\/(?:sales-direct-sale|quotation|sales-order|sales-delivery|sales-invoice|sales-return|batch-payment|sales-payment|customer-debit|refund)-details\/(\d+)/
  );
  return m ? Number(m[1]) : null;
}

function directPurchaseIdFromPath(pathname) {
  const m = pathname.match(/\/direct-purchase-details\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function purchaseDocIdFromPath(pathname) {
  const m = pathname.match(
    /\/(?:direct-purchase|requisition|order|receipt|bill|return|batch-payment|payment|supplier-credit|refund)-details\/(\d+)/
  );
  return m ? Number(m[1]) : null;
}

function buildDirectSaleFallback(id, config) {
  if (!id) return null;
  return {
    id,
    orderNumber: `DSO-${String(id).padStart(6, "0")}`,
    date: "14 Sep 2026",
    type: config?.txnType || "Direct Sale",
    salesPerson: "Demo",
    status: "Completed",
    customer: "Walk-in Customer",
    customerPhone: "01700000000",
    grandTotal: "৳ 120",
    lines: [
      {
        id: 1,
        item: "Katari Rice",
        meta: "M: GMPS, B: তীর",
        orderedQty: "1 kg",
        billedQty: "1 kg",
        deliveredQty: "1 kg",
        returnedQty: "0 kg",
        price: "৳ 120",
        discount: "N/A",
        amount: "৳ 120",
      },
    ],
    deliveries: [
      {
        number: `DEL-${String(1000 + id)}`,
        date: "14 Sep 2026",
        type: "Store Pickup",
        status: "Delivered",
      },
    ],
    invoices: [
      {
        number: `INV-2026-${String(id).padStart(6, "0")}`,
        date: "14 Sep 2026",
        paid: "৳ 0",
        due: "৳ 120",
        total: "৳ 120",
        status: "Unpaid",
      },
    ],
  };
}

function buildDirectPurchaseFallback(id, config) {
  if (!id) return null;
  return {
    id,
    orderNumber: `DP-${String(id).padStart(6, "0")}`,
    date: "14 Sep 2026",
    type: config?.txnType || "Direct Purchase",
    salesPerson: "Demo",
    status: "Completed",
    customer: "Rahim",
    customerPhone: "01700000000",
    grandTotal: "৳ 77,500",
    lines: [
      {
        id: 1,
        item: "Bag",
        meta: "M: Default, B: Default",
        orderedQty: "50 pc",
        billedQty: "50 pc",
        deliveredQty: "50 pc",
        returnedQty: "0 pc",
        price: "৳ 1,550",
        discount: "N/A",
        amount: "৳ 77,500",
      },
    ],
    receipts: [
      {
        number: `GRN-${String(700 + id).padStart(6, "0")}`,
        date: "14 Sep 2026",
        type: "Warehouse Receipt",
        status: "Completed",
      },
    ],
    bills: [
      {
        number: `BILL-2026-${String(id).padStart(6, "0")}`,
        date: "14 Sep 2026",
        paid: "৳ 0",
        due: "৳ 77,500",
        total: "৳ 77,500",
        status: "Unpaid",
      },
    ],
  };
}

const PRICE_LIST_SEED = {
  1: {
    id: 1,
    name: "Strip Light - Purchase",
    description: "",
    transaction_type: "Purchase",
    price_list_type: "Individual Items",
    pricing_scheme: "Unit Pricing",
    include_discount: false,
    status: "Active",
    line_items: [{ item: "Strip Light - 100 Feet", rate: "90" }],
  },
  2: {
    id: 2,
    name: "Light - Sales",
    description: "",
    transaction_type: "Sales",
    price_list_type: "Individual Items",
    pricing_scheme: "Unit Pricing",
    include_discount: false,
    status: "Active",
    line_items: [{ item: "LED Bulb 12W", rate: "120" }],
  },
  3: {
    id: 3,
    name: "Light - Purchs",
    description: "",
    transaction_type: "Purchase",
    price_list_type: "Individual Items",
    pricing_scheme: "Unit Pricing",
    include_discount: false,
    status: "Active",
    line_items: [{ item: "LED Bulb 12W", rate: "95" }],
  },
  4: {
    id: 4,
    name: "Light",
    description: "",
    transaction_type: "Purchase",
    price_list_type: "Individual Items",
    pricing_scheme: "Unit Pricing",
    include_discount: false,
    status: "Active",
    line_items: [{ item: "LED Bulb 12W", rate: "100" }],
  },
  5: {
    id: 5,
    name: "oil",
    description: "",
    transaction_type: "Sales",
    price_list_type: "All Items",
    percentage_mode: "Markup",
    percentage: "10",
    round_off: "Never mind",
    status: "Active",
  },
  6: {
    id: 6,
    name: "Import",
    description: "",
    transaction_type: "Sales",
    price_list_type: "Individual Items",
    pricing_scheme: "Unit Pricing",
    include_discount: false,
    status: "Active",
    line_items: [{ item: "Notebook", rate: "45" }],
  },
  7: {
    id: 7,
    name: "Bulk Purchase",
    description: "",
    transaction_type: "Purchase",
    price_list_type: "Individual Items",
    pricing_scheme: "Volume Pricing",
    include_discount: false,
    status: "Active",
    line_items: [{ item: "Paper A4", rate: "280" }],
  },
  8: {
    id: 8,
    name: "Wholesale",
    description: "",
    transaction_type: "Sales",
    price_list_type: "All Items",
    percentage_mode: "Markdown",
    percentage: "5",
    round_off: "Nearest Whole Number",
    status: "Active",
  },
};

const OUTLET_SEED = {
  270: {
    name: "Food Cart",
    number: "0174455554",
    address: "Dhaka",
    warehouse: "Food Cart",
    cash_account: "Pos Cash",
    add_mobile_banking: true,
    mobile_banking: ["Bkash Merchant", "Rocket"],
  },
  271: {
    name: "Ash Bazar - Jamalkhan",
    number: "",
    address: "",
    warehouse: "Jamalkhan",
    cash_account: "Cash Jamalkhan",
    add_banking: true,
    banking_methods: ["City Bank POS"],
    add_mobile_banking: true,
    mobile_banking: ["Bkash"],
  },
  272: {
    name: "Bogura Outlet",
    number: "16222",
    address: "Akash tower",
    warehouse: "Default",
    cash_account: "Bogura Outlet",
  },
  273: {
    name: "Dinajpuir Outlet",
    warehouse: "Default",
    cash_account: "Dinajpur Outlet",
  },
  274: {
    name: "Narayangnj Outlet",
    warehouse: "Default",
    cash_account: "Narayanganj outllet",
  },
  275: {
    name: "Gulsan",
    warehouse: "Mirpur",
    cash_account: "Cash",
  },
};

function priceListIdFromPath(pathname) {
  const m = pathname.match(/\/price-list-(?:update|details)\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function outletIdFromPath(pathname) {
  const m = pathname.match(/\/outlet-update\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function customerIdFromPath(pathname) {
  const m = pathname.match(/\/customer-(?:update|details)\/(\d+)/);
  return m ? Number(m[1]) : null;
}

const CUSTOMER_SEED = {
  194297: {
    id: 194297,
    name: "Dalim Hossain",
    phone: "01733112669",
    email: "",
    code: "CMID-2026-000085",
    status: "Active",
    customer_type: "Service Point",
    opening_balance: "0.00",
    credit_limit: "0.00",
  },
  1: {
    id: 1,
    name: "Dalim Hossain",
    phone: "01733112669",
    code: "CMID-2026-000085",
    status: "Active",
  },
};

function supportTicketIdFromPath(pathname) {
  const m = pathname.match(/\/support-tickets\/details\/(\d+)/);
  return m ? Number(m[1]) : null;
}

const SUPPORT_TICKET_SEED = {
  1: {
    id: 1,
    ticketNumber: "ST-2026-004987",
    date: "11 Sep 2026",
    issue:
      "URGENT: Admin Password Reset Request & Account Recovery – Ashulia Network BM (v8.2.4)",
    category: "Quotations",
    email: "bmisp2025@gmail.com",
    phone: "01771949542",
    status: "Open",
    supportUnit: "Softifybd Support",
    details:
      "Please reset admin password and recover account access for Ashulia Network BM v8.2.4.",
    messages: [
      {
        id: 1,
        author: "bmisp2025@gmail.com",
        time: "11 Sep 2026",
        body: "URGENT: Admin Password Reset Request & Account Recovery – Ashulia Network BM (v8.2.4)",
      },
    ],
  },
  2: {
    id: 2,
    ticketNumber: "ST-2026-004986",
    date: "31 Aug 2026",
    issue: "macreseller client local client",
    category: "Macreseller Support",
    email: "info.samim2@gmail.com",
    phone: "01723519000",
    status: "InProgress",
    supportUnit: "Technical Unit",
    details: "Macreseller local client sync issue.",
  },
};

export default function ModulePage({ pathname }) {
  const config = getPageConfig(pathname);

  if (!config) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="m-0 text-slate-500">No page found for {pathname}</p>
      </div>
    );
  }

  if (config.type === "special" && SPECIAL[config.special]) {
    const Comp = SPECIAL[config.special];
    if (config.special === "outlet-form") {
      const id = outletIdFromPath(pathname);
      return (
        <Comp
          config={{
            ...config,
            formMode: pathname.includes("outlet-update") ? "edit" : "create",
            initialValues: id ? { id } : config.initialValues || {},
          }}
        />
      );
    }
    if (config.special === "txn-details") {
      if (
        config.purchaseApiKey ||
        config.relatedMode === "purchase" ||
        config.module === "Purchase"
      ) {
        const id =
          purchaseDocIdFromPath(pathname) || directPurchaseIdFromPath(pathname);
        return <Comp config={config} record={{ id }} />;
      }
      const id = salesDocIdFromPath(pathname) || directSaleIdFromPath(pathname);
      return <Comp config={config} record={{ id }} />;
    }
    if (config.special === "txn-form") {
      return (
        <Suspense
          fallback={
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
              Loading…
            </div>
          }
        >
          <Comp config={config} />
        </Suspense>
      );
    }
    if (config.special === "customer-details") {
      const id = customerIdFromPath(pathname);
      return <Comp config={config} record={{ id, ...(config.initialValues || {}) }} />;
    }
    if (config.special === "support-ticket-details") {
      const id = supportTicketIdFromPath(pathname);
      const seed =
        (id && SUPPORT_TICKET_SEED[id]) ||
        {
          id,
          ticketNumber: `ST-2026-${String(4987 - (id || 1) + 1).padStart(6, "0")}`,
          date: "31 Aug 2026",
          issue: `Support ticket #${id}`,
          category: "General Support",
          email: "demo@biznify.com.bd",
          phone: "01700000000",
          status: "Open",
          supportUnit: "Softifybd Support",
          details: "Ticket details will appear here.",
        };
      return <Comp config={config} record={seed} />;
    }
    if (config.special === "acl-role-form" || config.special === "acl-user-invite") {
      return <Comp config={config} />;
    }
    if (config.special === "acl-role-details") {
      const id = aclRoleIdFromPath(pathname);
      return <Comp config={config} record={{ id }} />;
    }
    if (config.special === "acl-user-details") {
      const id = aclUserIdFromPath(pathname);
      return <Comp config={config} record={{ id }} />;
    }
    if (config.special === "inventory-details") {
      const parts = pathname.split("/");
      const id = Number(parts[parts.length - 1]) || 1;
      return <Comp config={config} record={{ id, ...(config.initialValues || {}) }} />;
    }
    if (config.special === "item-details") {
      const parts = pathname.split("/");
      const id = Number(parts[parts.length - 1]) || null;
      return <Comp config={config} record={{ id, ...(config.initialValues || {}) }} />;
    }
    if (config.special === "employee-form" || config.special === "employee-details") {
      return <Comp config={config} pathname={pathname} />;
    }
    if (
      config.special === "accounting-form" ||
      config.special === "accounting-details" ||
      config.special === "inventory-form"
    ) {
      const recordId =
        config.special === "inventory-form" ? inventoryIdFromPath(pathname) : null;
      return (
        <Suspense
          fallback={
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
              Loading…
            </div>
          }
        >
          <Comp config={config} recordId={recordId} />
        </Suspense>
      );
    }
    return <Comp config={config} />;
  }

  if (config.layout === "price-list") {
    const id = priceListIdFromPath(pathname);
    const seed =
      (id && PRICE_LIST_SEED[id]) ||
      (id
        ? {
            id,
            name: `Price List ${id}`,
            transaction_type: "Sales",
            price_list_type: "Individual Items",
            pricing_scheme: "Unit Pricing",
            status: "Active",
            line_items: [{ item: "", rate: "" }],
          }
        : config.initialValues || {});
    const mode =
      config.formMode ||
      (pathname.includes("price-list-details")
        ? "details"
        : pathname.includes("price-list-update")
          ? "edit"
          : "create");
    return <PriceListFormPage config={config} mode={mode} initialValues={seed} />;
  }

  if (config.type === "form") {
    if (pathname.startsWith("/en/sales/customer-update")) {
      const id = customerIdFromPath(pathname);
      const seed = (id && CUSTOMER_SEED[id]) || { name: `Customer ${id}`, phone: "" };
      return <FormPage config={config} initialValues={seed} />;
    }
    return <FormPage config={config} />;
  }

  return <ListPage config={config} pathname={pathname} />;
}
