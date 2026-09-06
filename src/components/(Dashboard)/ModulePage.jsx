"use client";

import { getPageConfig } from "../../data/dashboard/pageConfigs";
import ListPage from "./ListPage";
import FormPage from "./FormPage";
import AccountingDashboard from "./AccountingDashboard";
import ChartOfAccountsPage from "./ChartOfAccountsPage";
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
    return <Comp />;
  }

  if (config.type === "form") {
    return <FormPage config={config} />;
  }

  return <ListPage config={config} />;
}
