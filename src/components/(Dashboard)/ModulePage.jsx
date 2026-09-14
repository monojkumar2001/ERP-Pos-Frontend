"use client";

import { getPageConfig } from "../../data/dashboard/pageConfigs";
import ListPage from "./ListPage";
import FormPage from "./FormPage";
import PriceListFormPage from "./PriceListFormPage";
import AccountingDashboard from "./AccountingDashboard";
import ChartOfAccountsPage from "./ChartOfAccountsPage";
import ItemCategoriesPage from "./ItemCategoriesPage";
import ItemsPage from "./ItemsPage";
import AddItemPage from "./AddItemPage";
import AddItemGroupPage from "./AddItemGroupPage";
import OutletFormPage from "./OutletFormPage";
import TransactionFormPage from "./TransactionFormPage";
import TransactionDetailPage from "./TransactionDetailPage";
import {
  ReportsPage,
  ManufacturingOverviewPage,
  AttendanceSheetPage,
  BarcodePage,
} from "./SpecialPages";

const SPECIAL = {
  reports: ReportsPage,
  manufacturing: ManufacturingOverviewPage,
  attendance: AttendanceSheetPage,
  barcode: BarcodePage,
  "accounting-dash": AccountingDashboard,
  "chart-of-accounts": ChartOfAccountsPage,
  "item-categories": ItemCategoriesPage,
  items: ItemsPage,
  "add-item": AddItemPage,
  "add-item-group": AddItemGroupPage,
  "outlet-form": OutletFormPage,
  "txn-form": TransactionFormPage,
  "txn-detail": TransactionDetailPage,
};

const DIRECT_SALE_SEED = {
  1: {
    order_number: "DSO-001010",
    sale_date: "14 Sep 2026",
    customer: "Dalim Hossain",
    customer_phone: "01733112669",
    sales_person: "Demo",
    type: "Direct Sale",
    status: "Completed",
    grand_total: "৳ 120",
    lines: [
      {
        id: 1,
        item: "Katari Rice",
        description: "M: GMPS,  B: তীর,",
        ordered_qty: "1kg",
        billed_qty: "1kg",
        delivered_qty: "1kg",
        returned_qty: "0kg",
        price: "৳ 120",
        discount: "N/A",
        amount: "৳ 120",
      },
    ],
    deliveries: [
      {
        id: 1,
        number: "DEL-001282",
        date: "14 Sep 2026",
        type: "Store Pickup",
        status: "Delivered",
        action: true,
      },
    ],
    invoices: [
      {
        id: 1,
        number: "INV-2026-000320",
        date: "14 Sep 2026",
        paid: "৳ 0",
        due: "৳ 120",
        total: "৳ 120",
        status: "Unpaid",
        action: true,
      },
    ],
    returns: [],
  },
  2: {
    order_number: "DSO-001009",
    sale_date: "13 Sep 2026",
    customer: "Test Customer",
    customer_phone: "01700000000",
    sales_person: "Demo",
    type: "Direct Sale",
    status: "Completed",
    grand_total: "৳ 600",
    lines: [
      {
        id: 1,
        item: "Paper A4",
        description: "M: Local,  B: Generic,",
        ordered_qty: "5pc",
        billed_qty: "5pc",
        delivered_qty: "5pc",
        returned_qty: "0pc",
        price: "৳ 120",
        discount: "N/A",
        amount: "৳ 600",
      },
    ],
    deliveries: [
      {
        id: 1,
        number: "DEL-001281",
        date: "13 Sep 2026",
        type: "Store Pickup",
        status: "Delivered",
        action: true,
      },
    ],
    invoices: [
      {
        id: 1,
        number: "INV-2026-000319",
        date: "13 Sep 2026",
        paid: "৳ 600",
        due: "৳ 0",
        total: "৳ 600",
        status: "Paid",
        action: true,
      },
    ],
    returns: [],
  },
};

const PRICE_LIST_SEED = {
  1: {
    name: "Strip Light - Purchase",
    transaction_type: "Purchase",
    price_list_type: "Individual Items",
    pricing_scheme: "Unit Pricing",
    line_items: [{ item: "Strip Light - 100 Feet", rate: "90" }],
  },
  2: {
    name: "Light - Sales",
    transaction_type: "Sales",
    price_list_type: "Individual Items",
    pricing_scheme: "Unit Pricing",
    line_items: [{ item: "LED Bulb 12W", rate: "120" }],
  },
  5: {
    name: "oil",
    transaction_type: "Sales",
    price_list_type: "All Items",
    percentage_mode: "Markup",
    percentage: "10",
    round_off: "Never mind",
  },
  8: {
    name: "Wholesale",
    transaction_type: "Sales",
    price_list_type: "All Items",
    percentage_mode: "Markdown",
    percentage: "5",
    round_off: "Nearest Whole Number",
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

function directSaleIdFromPath(pathname) {
  const m = pathname.match(/\/sales-direct-sale-details\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function defaultDirectSaleDetail(id) {
  return {
    order_number: `DSO-${String(1000 + (id || 1)).padStart(6, "0")}`,
    sale_date: "14 Sep 2026",
    customer: "Walk-in Customer",
    customer_phone: "01700000000",
    sales_person: "Demo",
    type: "Direct Sale",
    status: "Completed",
    grand_total: "৳ 120",
    lines: [
      {
        id: 1,
        item: "Sample Item",
        description: "M: Demo,  B: Demo,",
        ordered_qty: "1pc",
        billed_qty: "1pc",
        delivered_qty: "1pc",
        returned_qty: "0pc",
        price: "৳ 120",
        discount: "N/A",
        amount: "৳ 120",
      },
    ],
    deliveries: [],
    invoices: [],
    returns: [],
  };
}

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
      const seed = (id && OUTLET_SEED[id]) || config.initialValues || {};
      return (
        <Comp
          config={{
            ...config,
            formMode: pathname.includes("outlet-update") ? "edit" : "create",
            initialValues: seed,
          }}
        />
      );
    }
    if (config.special === "txn-detail") {
      const id = directSaleIdFromPath(pathname);
      const seed =
        (id && DIRECT_SALE_SEED[id]) ||
        config.initialValues ||
        defaultDirectSaleDetail(id);
      return <Comp config={config} data={seed} />;
    }
    return <Comp config={config} />;
  }

  if (config.layout === "price-list") {
    const id = priceListIdFromPath(pathname);
    const seed = (id && PRICE_LIST_SEED[id]) || config.initialValues || {};
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
    return <FormPage config={config} />;
  }

  return <ListPage config={config} pathname={pathname} />;
}
