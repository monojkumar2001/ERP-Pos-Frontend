"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import FilterBar from "./FilterBar";
import DataTable from "./DataTable";
import EntityFormModal from "./EntityFormModal";
import EmailTemplateModal from "./EmailTemplateModal";
import SummaryCards from "./SummaryCards";
import { api, aclApi, masterApi, settingsApi } from "../../lib/api";
import {
  WORKING_SHIFTS,
  WEEKEND_DAYS,
} from "../../data/dashboard/employees";

const DETAILS_HREF = {
  "/en/sales/sales-direct-sales": "/en/sales/sales-direct-sale-details",
  "/en/sales/quotation-list": "/en/sales/quotation-details",
  "/en/sales/sales-orders": "/en/sales/sales-order-details",
  "/en/sales/sales-deliveries": "/en/sales/sales-delivery-details",
  "/en/sales/sales-invoices": "/en/sales/sales-invoice-details",
  "/en/sales/sales-returns": "/en/sales/sales-return-details",
  "/en/sales/batch-payments": "/en/sales/batch-payment-details",
  "/en/sales/sales-payments": "/en/sales/sales-payment-details",
  "/en/sales/customer-debits": "/en/sales/customer-debit-details",
  "/en/sales/refunds": "/en/sales/refund-details",
  "/en/sales/customers": "/en/sales/customer-details",
  "/en/support-tickets": "/en/support-tickets/details",
  "/en/acl/role/index": "/en/acl/role/role-details",
  "/en/acl/user/index": "/en/acl/user/user-details",
  "/en/inventory/stock-adjustments": "/en/inventory/stock-adjustment-details",
  "/en/inventory/warehouse-transfer-list": "/en/inventory/warehouse-transfer-details",
  "/en/inventory/receive-stock": "/en/inventory/warehouse-transfer-details",
  "/en/inventory/item-stock": "/en/item-config/item-details",
  "/en/item-config/items": "/en/item-config/item-details",
  "/en/purchase/direct-purchases": "/en/purchase/direct-purchase-details",
  "/en/purchase/requisitions": "/en/purchase/requisition-details",
  "/en/purchase/orders": "/en/purchase/order-details",
  "/en/purchase/receipts": "/en/purchase/receipt-details",
  "/en/purchase/bills": "/en/purchase/bill-details",
  "/en/purchase/returns": "/en/purchase/return-details",
  "/en/purchase/batch-payments": "/en/purchase/batch-payment-details",
  "/en/purchase/payments": "/en/purchase/payment-details",
  "/en/purchase/supplier-credits": "/en/purchase/supplier-credit-details",
  "/en/purchase/refunds": "/en/purchase/refund-details",
  "/en/purchase/suppliers": "/en/purchase/supplier-details",
  "/en/hrm/employee/employees": "/en/hrm/employee/employee-details",
  "/en/accounting/journals": "/en/accounting/journal-details",
  "/en/accounting/expenses": "/en/accounting/expense-details",
  "/en/accounting/incomes": "/en/accounting/income-details",
  "/en/accounting/transfer-money": "/en/accounting/transfer-details",
  "/en/accounting/recurring-journal": "/en/accounting/recurring-journal-details",
};

const EDIT_HREF = {
  "/en/sales/sales-direct-sales": "/en/sales/sales-direct-sale-create",
  "/en/sales/quotation-list": "/en/sales/quotation-create",
  "/en/sales/sales-orders": "/en/sales/sales-order-create",
  "/en/sales/customer-debits": "/en/sales/customer-debit-create",
  "/en/sales/customers": "/en/sales/customer-update",
  "/en/inventory/warehouse-transfer-list": "/en/inventory/warehouse-transfer",
  "/en/inventory/stock-adjustments": "/en/inventory/add-stock-adjustment",
  "/en/purchase/direct-purchases": "/en/purchase/direct-purchase-create",
  "/en/purchase/requisitions": "/en/purchase/requisition-create",
  "/en/purchase/orders": "/en/purchase/order-create",
  "/en/purchase/supplier-credits": "/en/purchase/supplier-credit-create",
  "/en/hrm/employee/employees": "/en/hrm/employee/employee-update",
  "/en/acl/role/index": "/en/acl/role/create",
  "/en/accounting/journals": "/en/accounting/journal-create",
  "/en/accounting/expenses": "/en/accounting/expense-create",
  "/en/accounting/incomes": "/en/accounting/income-create",
  "/en/accounting/transfer-money": "/en/accounting/transfer-create",
  "/en/accounting/recurring-journal": "/en/accounting/recurring-journal-create",
};

const ACCOUNTING_LIST_PATHS = new Set([
  "/en/accounting/journals",
  "/en/accounting/expenses",
  "/en/accounting/incomes",
  "/en/accounting/transfer-money",
  "/en/accounting/recurring-journal",
]);

const INVENTORY_CANCEL_ENDPOINTS = new Set([
  "/inventory/stock-adjustments",
  "/inventory/warehouse-transfers",
]);

const SALES_CANCEL_ENDPOINTS = new Set(["/sales/direct-invoices"]);
const PURCHASE_CANCEL_ENDPOINTS = new Set(["/purchase/direct-bills"]);

const SALES_QUERY_EDIT_PATHS = new Set([
  "/en/sales/sales-direct-sales",
  "/en/sales/quotation-list",
  "/en/sales/sales-orders",
  "/en/sales/customer-debits",
]);

const PURCHASE_QUERY_EDIT_PATHS = new Set([
  "/en/purchase/direct-purchases",
  "/en/purchase/requisitions",
  "/en/purchase/orders",
  "/en/purchase/supplier-credits",
]);

const SALES_DRAFT_EDIT_PATHS = new Set([
  "/en/sales/sales-direct-sales",
  "/en/sales/quotation-list",
  "/en/sales/sales-orders",
  "/en/sales/customer-debits",
  "/en/sales/sales-deliveries",
  "/en/sales/sales-invoices",
  "/en/sales/sales-returns",
  "/en/sales/sales-payments",
  "/en/sales/refunds",
]);

const PURCHASE_DRAFT_EDIT_PATHS = new Set([
  "/en/purchase/direct-purchases",
  "/en/purchase/requisitions",
  "/en/purchase/orders",
  "/en/purchase/supplier-credits",
  "/en/purchase/receipts",
  "/en/purchase/bills",
  "/en/purchase/returns",
  "/en/purchase/payments",
  "/en/purchase/refunds",
]);

const SUMMARY_CARD_TONES = ["blue", "pink", "green", "purple"];

function normalizeSummaryCards(cards) {
  if (!Array.isArray(cards) || !cards.length) return [];
  return cards.map((card, i) => ({
    key: card.key || `summary-${i}`,
    label: card.label || card.title || "",
    value: card.value,
    tone: card.tone || SUMMARY_CARD_TONES[i % SUMMARY_CARD_TONES.length],
    icon: card.icon,
  }));
}

const ITEM_MODALS = {
  "/en/item-config/brands": {
    title: "Add Brand",
    editTitle: "Update Brand",
    imageLabel: "Brand Logo",
    fields: [{ key: "brand", label: "Name", required: true, placeholder: "Brand Name" }],
    nameKey: "brand",
    actions: ["edit", "inactive", "add-discount", "remove-discount", "delete"],
  },
  "/en/item-config/manufacturers": {
    title: "Add Manufacturer",
    editTitle: "Update Manufacturer",
    imageLabel: "Manufacturer Logo",
    fields: [
      { key: "manufacturer", label: "Name", required: true, placeholder: "Manufacturer Name" },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Write description about manufacturer...",
      },
    ],
    nameKey: "manufacturer",
    actions: ["edit", "inactive", "add-discount", "remove-discount", "delete"],
  },
  "/en/item-config/colors": {
    title: "Add Color",
    editTitle: "Update Color",
    fields: [
      { key: "name", label: "Name", required: true, placeholder: "Color Name" },
      { key: "color_code", label: "Code", required: true, placeholder: "Enter code" },
    ],
    nameKey: "name",
    actions: ["edit", "inactive", "delete"],
  },
  "/en/item-config/item-sizes": {
    title: "Add Sizes",
    editTitle: "Update Sizes",
    fields: [
      {
        key: "size_type",
        label: "Size Type Name",
        required: true,
        placeholder: "Size Type Name",
      },
      {
        key: "added_sizes",
        label: "",
        type: "repeating",
        rowLabel: "SIZE NAME",
        placeholder: "Size Name",
        addRowLabel: "Add Size",
      },
    ],
    nameKey: "size_type",
    actions: ["edit", "inactive", "delete"],
  },
  "/en/item-config/item-attributes": {
    title: "Add Attributes",
    editTitle: "Update Attributes",
    fields: [
      {
        key: "attribute_set",
        label: "Attribute Set Name",
        required: true,
        placeholder: "Attribute Set Name",
      },
      {
        key: "added_attributes",
        label: "",
        type: "repeating",
        rowLabel: "ATTRIBUTE NAME",
        placeholder: "Attribute Name",
        addRowLabel: "Add Attribute",
      },
    ],
    nameKey: "attribute_set",
    actions: ["edit", "inactive", "delete"],
  },
  "/en/purchase/supplier-types": {
    title: "Add Supplier Type",
    editTitle: "Update Supplier Type",
    fields: [
      {
        key: "name",
        label: "Supplier Type Name",
        required: true,
        placeholder: "Enter supplier type name",
      },
    ],
    nameKey: "name",
    actions: ["edit", "inactive"],
  },
  "/en/sales/customer-types": {
    title: "Add Customer Type",
    editTitle: "Edit Customer Type",
    fields: [
      {
        key: "name",
        label: "Name",
        required: true,
        placeholder: "Enter customer type name",
      },
    ],
    nameKey: "name",
    actions: ["edit", "inactive"],
  },
  "/en/settings/email-templates": {
    title: "Add Template",
    editTitle: "Edit Template",
    fields: [
      { key: "type", label: "Type", required: true },
      { key: "name", label: "Name", required: true },
      { key: "subject", label: "Subject", required: true },
      { key: "body", label: "Body" },
    ],
    nameKey: "name",
    actions: ["edit", "inactive", "delete"],
    emailTemplate: true,
  },
};

const PATH_ACTIONS = {
  "/en/item-config/items": ["details", "edit", "inactive", "delete", "edit-opening-stock"],
  "/en/item-config/price-list": ["details", "edit", "deactivate", "delete"],
  "/en/pos/outlets": ["edit", "inactive"],
  "/en/sales/customers": ["details", "edit", "inactive"],
  "/en/sales/sales-direct-sales": ["details", "edit", "cancel"],
  "/en/sales/quotation-list": ["details", "edit", "approve", "convert-to-order", "delete"],
  "/en/sales/sales-orders": [
    "details",
    "edit",
    "approve",
    "convert-to-delivery",
    "convert-to-invoice",
    "delete",
  ],
  "/en/sales/sales-deliveries": ["details", "edit", "delete"],
  "/en/sales/sales-invoices": ["details", "edit", "delete"],
  "/en/sales/sales-returns": ["details", "edit", "delete"],
  "/en/sales/batch-payments": ["details", "delete"],
  "/en/sales/sales-payments": ["details", "edit", "delete"],
  "/en/sales/customer-debits": ["details", "edit", "approve", "delete"],
  "/en/sales/refunds": ["details", "edit", "delete"],
  "/en/support-tickets": ["details", "close"],
  "/en/acl/role/index": ["invite-user", "details", "edit", "clone", "delete"],
  "/en/acl/user/index": ["inactive", "details"],
  "/en/inventory/item-stock": [],
  "/en/inventory/stock-adjustments": ["details", "edit", "cancel"],
  "/en/inventory/warehouse-transfer-list": [
    "details",
    "edit",
    "initiate",
    "receive-stock",
  ],
  "/en/inventory/receive-stock": ["details", "receive-stock"],
  "/en/inventory/warehouse-access": ["delete"],
  "/en/tax/tax-list": ["edit", "delete"],
  "/en/discount/discount-list": ["edit", "change-effective-date"],
  "/en/settings/payment-methods": ["edit", "inactive", "delete"],
  "/en/inventory/warehouses": ["details", "edit", "delete"],
  "/en/inventory/bin-locations": ["edit", "delete"],
  "/en/settings/delivery-channels": ["edit", "delete"],
  "/en/settings/delivery-charges": ["edit", "delete"],
  "/en/inventory/adjustment-reasons": ["edit", "inactive"],
  "/en/settings/custom-fields": ["edit", "inactive", "delete"],
  "/en/item-config/uom-conversions": ["edit", "delete"],
  "/en/purchase/direct-purchases": ["details", "edit", "cancel"],
  "/en/purchase/requisitions": ["details", "edit", "approve", "convert-to-order", "delete"],
  "/en/purchase/orders": [
    "details",
    "edit",
    "approve",
    "convert-to-receipt",
    "convert-to-bill",
    "delete",
  ],
  "/en/purchase/receipts": ["details"],
  "/en/purchase/bills": ["details"],
  "/en/purchase/returns": ["details"],
  "/en/purchase/batch-payments": ["details"],
  "/en/purchase/payments": ["details"],
  "/en/purchase/supplier-credits": ["details", "edit", "approve", "delete"],
  "/en/purchase/refunds": ["details"],
  "/en/purchase/suppliers": ["details", "edit", "inactive"],
  "/en/hrm/employee/employees": ["details", "edit", "inactive", "delete"],
  "/en/settings/email-templates": ["edit", "inactive", "delete"],
  "/en/accounting/journals": ["details", "edit", "approve", "delete"],
  "/en/accounting/expenses": ["details", "edit", "approve", "delete"],
  "/en/accounting/incomes": ["details", "edit", "approve", "delete"],
  "/en/accounting/transfer-money": ["details", "edit", "approve", "delete"],
  "/en/accounting/recurring-journal": ["details", "edit", "run", "delete"],
};

function toggleStatus(row) {
  return String(row.status).toLowerCase() === "inactive" ||
    String(row.status).toLowerCase() === "deactivated"
    ? "Active"
    : "Inactive";
}

function formatRepeatingCell(value) {
  if (Array.isArray(value)) {
    const names = value
      .map((v) => (typeof v === "object" && v?.name != null ? v.name : String(v)))
      .filter(Boolean);
    return names.length ? names.join(", ") : "N/A";
  }
  return value ?? "N/A";
}

function formatDiscountRate(row) {
  if (row.rate != null && row.rate !== "") return row.rate;
  if (row.value == null || row.value === "") return "N/A";
  const suffix = row.type === "fixed" ? "" : "%";
  return `${row.value}${suffix}`;
}

function mapListRows(rows, pathname) {
  return (rows || []).map((row) => {
    const next = { ...row };
    if (pathname === "/en/item-config/item-sizes") {
      next.added_sizes = formatRepeatingCell(row.added_sizes || row.sizes);
    }
    if (pathname === "/en/item-config/item-attributes") {
      next.added_attributes = formatRepeatingCell(row.added_attributes || row.attributes);
    }
    if (pathname === "/en/sales/customers" && row.since && !row.customer_since) {
      next.customer_since = row.since;
    }
    if (pathname === "/en/tax/tax-list" && row.rate != null && next.rate_ == null) {
      next.rate_ = row.rate;
    }
    if (pathname === "/en/discount/discount-list") {
      next.rate = formatDiscountRate(row);
      if (row.effective_to == null) next.effective_to = "N/A";
    }
    if (pathname === "/en/inventory/adjustment-reasons") {
      if (row.name && !row.adjustment_reason) next.adjustment_reason = row.name;
      if (row.type === "increase") next.type = "Add";
      else if (row.type === "decrease") next.type = "Subtract";
    }
    if (pathname === "/en/settings/custom-fields") {
      if (row.entity && !row.applied_on) next.applied_on = row.entity;
      if (row.field_type && !row.data_type) next.data_type = row.field_type;
      if (row.description == null) next.description = "N/A";
    }
    if (pathname === "/en/settings/delivery-charges") {
      if (row.zone && !next.district) next.district = row.zone;
      if (row.charge != null && next.up_to_0_5_kg == null) next.up_to_0_5_kg = row.charge;
    }
    return next;
  });
}

function buildApiPayload(form, modalCfg) {
  const out = { ...form };
  modalCfg?.fields?.forEach((f) => {
    if (f.type === "repeating") {
      out[f.key] = (form[f.key] || [])
        .map((s) => String(s).trim())
        .filter(Boolean)
        .map((name, position) => ({ name, position }));
    }
  });
  return out;
}

export default function ListPage({ config, pathname }) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);
  const [rows, setRows] = useState(config?.rows || []);
  const [totalEntries, setTotalEntries] = useState(config?.totalEntries);
  const [totalAmount, setTotalAmount] = useState(config?.totalAmount);
  const [summaryCards, setSummaryCards] = useState(
    () => normalizeSummaryCards(config?.summaryCards) || config?.summaryCards || []
  );
  const [loading, setLoading] = useState(Boolean(config?.apiEndpoint));
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchModal, setBatchModal] = useState(null);
  const [batchShift, setBatchShift] = useState(WORKING_SHIFTS[0]);
  const [batchWeekends, setBatchWeekends] = useState(["Friday", "Saturday"]);
  const [resolvedFilters, setResolvedFilters] = useState(config?.filters || []);

  const modalCfg = ITEM_MODALS[pathname] || config?.modal || null;
  const isEmployees = pathname === "/en/hrm/employee/employees";

  useEffect(() => {
    const baseFilters = config?.filters || [];
    setResolvedFilters(baseFilters);
    const sources = [
      ...new Set(baseFilters.map((f) => f.optionsFrom).filter(Boolean)),
    ];
    if (!sources.length) return;

    let cancelled = false;
    const loaders = {
      warehouses: () => masterApi.warehouses.list(),
      manufacturers: () => masterApi.manufacturers.list(),
      brands: () => masterApi.brands.list(),
      itemCategories: () => masterApi.itemCategories.list(),
      adjustmentReasons: () => settingsApi.adjustmentReasons.list(),
    };

    Promise.all(
      sources.map((src) =>
        (loaders[src] ? loaders[src]() : Promise.resolve({ rows: [] }))
          .then((data) => [
            src,
            (data.rows || []).map((r) => r.name || r.email || r.code).filter(Boolean),
          ])
          .catch(() => [src, []])
      )
    ).then((pairs) => {
      if (cancelled) return;
      const optionMap = Object.fromEntries(pairs);
      setResolvedFilters(
        baseFilters.map((f) =>
          f.optionsFrom
            ? { ...f, options: optionMap[f.optionsFrom] || [] }
            : f
        )
      );
    });

    return () => {
      cancelled = true;
    };
  }, [config?.filters, pathname]);

  const loadList = () => {
    if (!config?.apiEndpoint) {
      setRows(config?.rows || []);
      setTotalEntries(config?.totalEntries);
      setTotalAmount(config?.totalAmount);
      setSummaryCards(normalizeSummaryCards(config?.summaryCards));
      setLoading(false);
      setError("");
      return Promise.resolve();
    }

    setLoading(true);
    setError("");

    return api(config.apiEndpoint)
      .then((data) => {
        const list = mapListRows(data.rows || [], pathname);
        setRows(list);
        setTotalEntries(data.totalEntries ?? list.length);
        setTotalAmount(data.totalAmount);
        setSummaryCards(
          data.summaryCards?.length
            ? normalizeSummaryCards(data.summaryCards)
            : normalizeSummaryCards(config?.summaryCards)
        );
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    if (!config?.apiEndpoint) {
      setRows(config?.rows || []);
      setTotalEntries(config?.totalEntries);
      setTotalAmount(config?.totalAmount);
      setSummaryCards(normalizeSummaryCards(config?.summaryCards));
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    api(config.apiEndpoint)
      .then((data) => {
        if (cancelled) return;
        const list = mapListRows(data.rows || [], pathname);
        setRows(list);
        setTotalEntries(data.totalEntries ?? list.length);
        setTotalAmount(data.totalAmount);
        setSummaryCards(
          data.summaryCards?.length
            ? normalizeSummaryCards(data.summaryCards)
            : normalizeSummaryCards(config?.summaryCards)
        );
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load data");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [config?.apiEndpoint, config?.title, pathname]);

  const openAdd = () => {
    if (!modalCfg) return;
    if (modalCfg.emailTemplate) {
      setForm({
        type: "General Template",
        name: "",
        subject: "",
        body: "",
      });
      setModal({ mode: "add" });
      return;
    }
    const initial = {};
    modalCfg.fields.forEach((f) => {
      initial[f.key] = f.type === "repeating" ? [""] : "";
    });
    setForm(initial);
    setModal({ mode: "add" });
  };

  const openEdit = (row) => {
    if (!modalCfg) return;
    if (modalCfg.emailTemplate) {
      setForm({
        type: row.type || "General Template",
        name: row.name || "",
        subject: row.subject || row.name || "",
        body: row.body || "",
      });
      setModal({ mode: "edit", row });
      return;
    }
    const initial = {};
    modalCfg.fields.forEach((f) => {
      if (f.type === "repeating") {
        const raw = row[f.key];
        if (Array.isArray(raw)) initial[f.key] = raw.length ? raw : [""];
        else if (typeof raw === "string" && raw && raw !== "N/A")
          initial[f.key] = raw.split(",").map((s) => s.trim());
        else initial[f.key] = [""];
      } else {
        initial[f.key] = row[f.key] ?? "";
      }
    });
    setForm(initial);
    setModal({ mode: "edit", row });
  };

  const normalizeForm = () => {
    const out = { ...form };
    modalCfg?.fields?.forEach((f) => {
      if (f.type === "repeating") {
        out[f.key] = (form[f.key] || []).map((s) => String(s).trim()).filter(Boolean).join(", ") || "N/A";
      }
    });
    return out;
  };

  const onSave = async () => {
    const nameKey = modalCfg.nameKey || modalCfg.fields[0]?.key;
    if (nameKey && !String(form[nameKey] || "").trim()) return;

    if (config?.apiEndpoint) {
      const payload = buildApiPayload(form, modalCfg);
      try {
        if (modal?.mode === "edit" && modal.row) {
          await api(`${config.apiEndpoint}/${modal.row.id}`, {
            method: "PUT",
            body: payload,
          });
        } else {
          await api(config.apiEndpoint, { method: "POST", body: payload });
        }
        setModal(null);
        await loadList();
      } catch (err) {
        setError(err.message || "Failed to save");
      }
      return;
    }

    const payload = normalizeForm();

    if (modal?.mode === "edit" && modal.row) {
      setRows((prev) =>
        prev.map((r) => (r.id === modal.row.id ? { ...r, ...payload } : r))
      );
    } else {
      setRows((prev) => [
        {
          id: Date.now(),
          status: "Active",
          discount: "N/A",
          ...Object.fromEntries(
            (config.columns || [])
              .filter((c) => !["status", "action", "_check"].includes(c.key) && !(c.key in payload))
              .map((c) => [c.key, "N/A"])
          ),
          ...payload,
        },
        ...prev,
      ]);
      setTotalEntries((n) => (n || rows.length) + 1);
    }
    setModal(null);
  };

  const actionKeys =
    modalCfg?.actions ||
    PATH_ACTIONS[pathname] ||
    ["edit", "inactive", "delete"];

  const rowActions = useMemo(() => {
    const setStatus = (row, status) =>
      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== row.id) return r;
          const next = { ...r, status };
          if ("order_status" in r) next.order_status = status;
          if ("delivery_status" in r && status === "Cancelled") next.delivery_status = status;
          return next;
        })
      );

    const setDiscount = (row, value) =>
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, discount: value } : r))
      );

    const defs = {
      details: {
        key: "details",
        label: "Details",
        getHref: (row) => {
          if (pathname === "/en/item-config/price-list") {
            return `/en/item-config/price-list-details/${row.id}`;
          }
          const base = DETAILS_HREF[pathname];
          if (!base) return undefined;
          if (ACCOUNTING_LIST_PATHS.has(pathname)) return `${base}?id=${row.id}`;
          return `${base}/${row.id}`;
        },
        onClick: (row) => {
          if (pathname === "/en/item-config/price-list") {
            router.push(`/en/item-config/price-list-details/${row.id}`);
            return;
          }
          const base = DETAILS_HREF[pathname];
          if (!base) return;
          if (ACCOUNTING_LIST_PATHS.has(pathname)) {
            router.push(`${base}?id=${row.id}`);
            return;
          }
          router.push(`${base}/${row.id}`);
        },
      },
      edit: {
        key: "edit",
        label: "Edit",
        getDisabled: (row) => {
          if (
            ACCOUNTING_LIST_PATHS.has(pathname) &&
            pathname !== "/en/accounting/recurring-journal"
          ) {
            return String(row.status).toLowerCase() !== "draft";
          }
          if (pathname === "/en/inventory/warehouse-transfer-list") {
            const s = String(row.status).toLowerCase();
            return !["draft", "requested"].includes(s);
          }
          if (pathname === "/en/inventory/stock-adjustments") {
            return String(row.status).toLowerCase() !== "draft";
          }
          if (SALES_DRAFT_EDIT_PATHS.has(pathname) || PURCHASE_DRAFT_EDIT_PATHS.has(pathname)) {
            const s = String(row.status || row.order_status || "").toLowerCase();
            return s !== "draft";
          }
          return false;
        },
        getHref: (row) => {
          if (modalCfg) return undefined;
          if (pathname === "/en/item-config/price-list") {
            return `/en/item-config/price-list-update/${row.id}`;
          }
          if (pathname === "/en/pos/outlets") {
            return `/en/pos/outlet-update/${row.id}`;
          }
          if (pathname === "/en/hrm/employee/employees") {
            return `/en/hrm/employee/employee-update/${row.id}`;
          }
          const base = EDIT_HREF[pathname];
          if (!base) return undefined;
          if (ACCOUNTING_LIST_PATHS.has(pathname)) return `${base}?id=${row.id}`;
          if (
            pathname === "/en/inventory/warehouse-transfer-list" ||
            pathname === "/en/inventory/stock-adjustments" ||
            SALES_QUERY_EDIT_PATHS.has(pathname) ||
            PURCHASE_QUERY_EDIT_PATHS.has(pathname)
          ) {
            return `${base}?id=${row.id}`;
          }
          if (pathname === "/en/sales/customers") return `${base}/${row.id}`;
          return base;
        },
        onClick: (row) => {
          if (modalCfg) {
            openEdit(row);
            return;
          }
          if (pathname === "/en/item-config/price-list") {
            router.push(`/en/item-config/price-list-update/${row.id}`);
            return;
          }
          if (pathname === "/en/pos/outlets") {
            router.push(`/en/pos/outlet-update/${row.id}`);
            return;
          }
          const editBase = EDIT_HREF[pathname];
          if (editBase) {
            if (ACCOUNTING_LIST_PATHS.has(pathname)) {
              router.push(`${editBase}?id=${row.id}`);
              return;
            }
            if (
              pathname === "/en/inventory/warehouse-transfer-list" ||
              pathname === "/en/inventory/stock-adjustments" ||
              SALES_QUERY_EDIT_PATHS.has(pathname) ||
              PURCHASE_QUERY_EDIT_PATHS.has(pathname)
            ) {
              router.push(`${editBase}?id=${row.id}`);
              return;
            }
            const needsId =
              pathname === "/en/sales/customers" ||
              pathname === "/en/hrm/employee/employees";
            router.push(needsId ? `${editBase}/${row.id}` : editBase);
          }
        },
      },
      inactive: {
        key: "inactive",
        label: (row) =>
          String(row.status).toLowerCase() === "inactive" ? "Make Active" : "Make Inactive",
        onClick: async (row) => {
          const next =
            String(row.status).toLowerCase() === "inactive" ? "Active" : "Inactive";
          if (pathname === "/en/acl/user/index") {
            try {
              await aclApi.updateUserStatus(row.id, next);
            } catch {
              return;
            }
          } else if (config?.apiEndpoint) {
            try {
              await api(`${config.apiEndpoint}/${row.id}/status`, {
                method: "PATCH",
                body: { status: next },
              });
            } catch {
              return;
            }
          }
          setStatus(row, next);
        },
      },
      deactivate: {
        key: "deactivate",
        label: (row) =>
          String(row.status).toLowerCase() === "inactive" ||
          String(row.status).toLowerCase() === "deactivated"
            ? "Activate"
            : "Deactivate",
        onClick: async (row) => {
          const next = toggleStatus(row);
          if (config?.apiEndpoint) {
            try {
              if (next === "Inactive" || next === "Deactivated") {
                await api(`${config.apiEndpoint}/${row.id}/deactivate`, { method: "PATCH" });
              } else {
                await api(`${config.apiEndpoint}/${row.id}/status`, {
                  method: "PATCH",
                  body: { status: next },
                });
              }
            } catch {
              return;
            }
          }
          setStatus(row, next);
        },
      },
      "add-discount": {
        key: "add-discount",
        label: "Add Discount",
        onClick: async (row) => {
          if (config?.apiEndpoint) {
            try {
              await api(`${config.apiEndpoint}/${row.id}/discount`, {
                method: "PATCH",
                body: { discount: "5%" },
              });
            } catch {
              return;
            }
          }
          setDiscount(row, "5%");
        },
      },
      "change-effective-date": {
        key: "change-effective-date",
        label: "Change Effective Date",
        onClick: async (row) => {
          const from = window.prompt(
            "Effective from (YYYY-MM-DD)",
            row.effective_from || ""
          );
          if (from === null) return;
          const to = window.prompt(
            "Effective to (YYYY-MM-DD, leave blank for none)",
            row.effective_to && row.effective_to !== "N/A" ? row.effective_to : ""
          );
          if (to === null) return;
          if (config?.apiEndpoint) {
            try {
              await api(`${config.apiEndpoint}/${row.id}/effective-date`, {
                method: "PATCH",
                body: {
                  effective_from: from || null,
                  effective_to: to || null,
                },
              });
              await loadList();
            } catch {
              return;
            }
            return;
          }
          setRows((prev) =>
            prev.map((r) =>
              r.id === row.id
                ? {
                    ...r,
                    effective_from: from || r.effective_from,
                    effective_to: to || "N/A",
                  }
                : r
            )
          );
        },
      },
      "remove-discount": {
        key: "remove-discount",
        label: "Remove Discount",
        getDisabled: (row) => !row.discount || row.discount === "N/A",
        onClick: async (row) => {
          if (config?.apiEndpoint) {
            try {
              await api(`${config.apiEndpoint}/${row.id}/discount`, {
                method: "PATCH",
                body: { discount: "N/A" },
              });
            } catch {
              return;
            }
          }
          setDiscount(row, "N/A");
        },
      },
      "edit-opening-stock": {
        key: "edit-opening-stock",
        label: "Edit Opening Stock",
      },
      cancel: {
        key: "cancel",
        label: "Cancel",
        getDisabled: (row) => {
          const s = String(row.status).toLowerCase();
          if (config?.apiEndpoint === "/inventory/stock-adjustments") {
            return ["cancelled", "approved"].includes(s);
          }
          if (config?.apiEndpoint === "/inventory/warehouse-transfers") {
            return ["cancelled", "received"].includes(s);
          }
          if (
            config?.apiEndpoint === "/sales/direct-invoices" ||
            config?.apiEndpoint === "/purchase/direct-bills"
          ) {
            return ["cancelled"].includes(s);
          }
          return false;
        },
        onClick: async (row) => {
          const endpoint = config?.apiEndpoint;
          if (
            endpoint &&
            (INVENTORY_CANCEL_ENDPOINTS.has(endpoint) ||
              SALES_CANCEL_ENDPOINTS.has(endpoint) ||
              PURCHASE_CANCEL_ENDPOINTS.has(endpoint))
          ) {
            try {
              await api(`${endpoint}/${row.id}/cancel`, { method: "PATCH" });
              setStatus(row, "Cancelled");
            } catch {
              return;
            }
            return;
          }
          setStatus(row, "Cancelled");
        },
      },
      initiate: {
        key: "initiate",
        label: "Initiate",
        getDisabled: (row) => String(row.status).toLowerCase() !== "requested",
        getHref: (row) => `/en/inventory/warehouse-transfer-initiate/${row.id}`,
        onClick: (row) =>
          router.push(`/en/inventory/warehouse-transfer-initiate/${row.id}`),
      },
      "receive-stock": {
        key: "receive-stock",
        label: "Receive Stock",
        getDisabled: (row) => String(row.status).toLowerCase() !== "initiated",
        getHref: (row) => `/en/inventory/receive-stock-create/${row.id}`,
        onClick: (row) => router.push(`/en/inventory/receive-stock-create/${row.id}`),
      },
      close: {
        key: "close",
        label: "Close",
        onClick: (row) => setStatus(row, "Closed"),
      },
      "invite-user": {
        key: "invite-user",
        label: "Invite a user",
        getHref: () => "/en/acl/user/invite",
        getDisabled: (row) =>
          String(row.role_name || "").toLowerCase() === "administrator" ||
          row.is_system,
      },
      clone: {
        key: "clone",
        label: "Clone",
        onClick: async (row) => {
          if (pathname === "/en/acl/role/index") {
            try {
              const res = await aclApi.cloneRole(row.id);
              const payload = res?.data || res;
              setRows((prev) => [
                {
                  id: payload.id,
                  role_name: payload.role_name || payload.name,
                  redirect_url: payload.redirect_url,
                  is_system: false,
                },
                ...prev,
              ]);
              setTotalEntries((n) => (n || rows.length) + 1);
              return;
            } catch {
              /* fall through to local clone */
            }
          }
          setRows((prev) => [
            {
              ...row,
              id: Date.now(),
              role_name: `${row.role_name} (Copy)`,
            },
            ...prev,
          ]);
          setTotalEntries((n) => (n || rows.length) + 1);
        },
      },
      approve: {
        key: "approve",
        label: "Approve",
        getDisabled: (row) => {
          const s = String(row.status || row.order_status || "").toLowerCase();
          return s !== "draft";
        },
        onClick: async (row) => {
          const nextStatus =
            config?.apiEndpoint === "/sales/direct-invoices" ||
            config?.apiEndpoint === "/purchase/direct-bills"
              ? "Completed"
              : "Approved";
          if (config?.apiEndpoint) {
            try {
              await api(`${config.apiEndpoint}/${row.id}/status`, {
                method: "PATCH",
                body: { status: nextStatus },
              });
            } catch {
              return;
            }
          }
          setStatus(row, nextStatus);
        },
      },
      "convert-to-order": {
        key: "convert-to-order",
        label: "Convert to Order",
        getDisabled: (row) => String(row.status).toLowerCase() !== "approved",
        onClick: async (row) => {
          if (!config?.apiEndpoint) return;
          try {
            await api(`${config.apiEndpoint}/${row.id}/convert-to-order`, {
              method: "POST",
            });
            router.push(
              pathname.startsWith("/en/purchase/")
                ? "/en/purchase/orders"
                : "/en/sales/sales-orders"
            );
          } catch {
            /* ignore */
          }
        },
      },
      "convert-to-delivery": {
        key: "convert-to-delivery",
        label: "Convert to Delivery",
        getDisabled: (row) => {
          const s = String(row.status || row.order_status || "").toLowerCase();
          return s !== "approved";
        },
        onClick: async (row) => {
          if (!config?.apiEndpoint) return;
          try {
            await api(`${config.apiEndpoint}/${row.id}/convert-to-delivery`, {
              method: "POST",
            });
            router.push("/en/sales/sales-deliveries");
          } catch {
            /* ignore */
          }
        },
      },
      "convert-to-invoice": {
        key: "convert-to-invoice",
        label: "Convert to Invoice",
        getDisabled: (row) => {
          const s = String(row.status || row.order_status || "").toLowerCase();
          return s !== "approved";
        },
        onClick: async (row) => {
          if (!config?.apiEndpoint) return;
          try {
            await api(`${config.apiEndpoint}/${row.id}/convert-to-invoice`, {
              method: "POST",
            });
            router.push("/en/sales/sales-invoices");
          } catch {
            /* ignore */
          }
        },
      },
      "convert-to-receipt": {
        key: "convert-to-receipt",
        label: "Convert to Receipt",
        getDisabled: (row) => {
          const s = String(row.status || row.order_status || "").toLowerCase();
          return s !== "approved";
        },
        onClick: async (row) => {
          if (!config?.apiEndpoint) return;
          try {
            await api(`${config.apiEndpoint}/${row.id}/convert-to-receipt`, {
              method: "POST",
            });
            router.push("/en/purchase/receipts");
          } catch {
            /* ignore */
          }
        },
      },
      "convert-to-bill": {
        key: "convert-to-bill",
        label: "Convert to Bill",
        getDisabled: (row) => {
          const s = String(row.status || row.order_status || "").toLowerCase();
          return s !== "approved";
        },
        onClick: async (row) => {
          if (!config?.apiEndpoint) return;
          try {
            await api(`${config.apiEndpoint}/${row.id}/convert-to-bill`, {
              method: "POST",
            });
            router.push("/en/purchase/bills");
          } catch {
            /* ignore */
          }
        },
      },
      run: {
        key: "run",
        label: "Run Now",
        onClick: async (row) => {
          if (!config?.apiEndpoint) return;
          try {
            await api(`${config.apiEndpoint}/${row.id}/run`, { method: "POST" });
            await loadList();
          } catch {
            /* ignore */
          }
        },
      },
      delete: {
        key: "delete",
        label: "Delete",
        getDisabled: (row) => {
          if (pathname === "/en/acl/role/index") {
            return (
              row.is_system ||
              String(row.role_name || "").toLowerCase() === "administrator"
            );
          }
          if (
            ACCOUNTING_LIST_PATHS.has(pathname) &&
            pathname !== "/en/accounting/recurring-journal"
          ) {
            return String(row.status).toLowerCase() !== "draft";
          }
          if (pathname.startsWith("/en/sales/") && config?.apiEndpoint?.startsWith("/sales/")) {
            return String(row.status || row.order_status || "").toLowerCase() !== "draft";
          }
          return false;
        },
        onClick: async (row) => {
          if (pathname === "/en/acl/role/index") {
            try {
              await aclApi.deleteRole(row.id);
            } catch {
              return;
            }
          } else if (config?.apiEndpoint) {
            try {
              await api(`${config.apiEndpoint}/${row.id}`, { method: "DELETE" });
            } catch {
              return;
            }
          }
          setRows((prev) => prev.filter((r) => r.id !== row.id));
          setTotalEntries((n) => Math.max(0, (n || rows.length) - 1));
        },
      },
    };

    return actionKeys.map((k) => defs[k]).filter(Boolean);
  }, [actionKeys.join("|"), !!modalCfg, rows.length, pathname, router, config?.apiEndpoint]);

  if (!config) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Page not configured
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={config.title}
        addLabel={config.addLabel}
        addHref={config.addHref}
        secondaryAddLabel={config.secondaryAddLabel}
        secondaryAddHref={config.secondaryAddHref}
        onSecondaryAddClick={
          config.secondaryAddLabel === "Generate" && config.apiEndpoint
            ? async () => {
                setError("");
                try {
                  await api(`${config.apiEndpoint}/generate`, { method: "POST" });
                  await loadList();
                } catch (err) {
                  setError(err.message || "Failed to generate");
                }
              }
            : undefined
        }
        onAddClick={modalCfg ? openAdd : undefined}
        onFilterToggle={
          config.hideFilterToggle
            ? undefined
            : () => setShowFilters((v) => !v)
        }
        showExport={
          ![
            "/en/item-config/brands",
            "/en/item-config/manufacturers",
            "/en/item-config/colors",
            "/en/item-config/item-sizes",
            "/en/item-config/item-attributes",
            "/en/item-config/price-list",
            "/en/purchase/supplier-types",
            "/en/sales/customer-types",
            "/en/support-tickets",
            "/en/inventory/warehouse-access",
            "/en/hrm/employee/employees",
            "/en/settings/email-templates",
            "/en/acl/role/index",
            "/en/acl/user/index",
          ].includes(pathname)
        }
        batchActions={
          isEmployees
            ? [
                {
                  key: "office-time",
                  label: "Change Office Time",
                  disabled: selectedIds.length === 0,
                  onClick: () => setBatchModal("office-time"),
                },
                {
                  key: "weekend",
                  label: "Assign Weekend",
                  disabled: selectedIds.length === 0,
                  onClick: () => setBatchModal("weekend"),
                },
              ]
            : []
        }
      />
      {summaryCards?.length > 0 && (
        <SummaryCards cards={summaryCards} />
      )}
      {showFilters && <FilterBar filters={resolvedFilters} />}
      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading…
        </div>
      ) : (
        <DataTable
          columns={config.columns || []}
          rows={rows}
          totalEntries={totalEntries}
          totalAmount={totalAmount}
          amountKey={config.amountKey}
          rowActions={rowActions}
          selectedIds={isEmployees ? selectedIds : undefined}
          onSelectionChange={isEmployees ? setSelectedIds : undefined}
          onLinkClick={(row, col) => {
            if (pathname === "/en/settings/email-templates" && col.key === "name") {
              openEdit(row);
              return;
            }
            if (
              col.key === "order_number" ||
              col.key === "quotation_number" ||
              col.key === "quotation_no" ||
              col.key === "invoice_number" ||
              col.key === "invoice_no" ||
              col.key === "delivery_number" ||
              col.key === "return_number" ||
              col.key === "payment_number" ||
              col.key === "batch_number" ||
              col.key === "refund_number" ||
              col.key === "credit_number" ||
              col.key === "ticket_number" ||
              col.key === "adjustment_number" ||
              col.key === "transfer_number" ||
              col.key === "item" ||
              col.key === "role_name" ||
              (pathname === "/en/acl/user/index" && col.key === "email") ||
              (pathname === "/en/hrm/employee/employees" && col.key === "code") ||
              (pathname === "/en/sales/customers" && col.key === "name") ||
              (pathname === "/en/item-config/price-list" && col.key === "name") ||
              (pathname === "/en/item-config/items" &&
                (col.key === "name" || col.key === "code")) ||
              (pathname === "/en/inventory/item-stock" &&
                (col.key === "item" || col.key === "code")) ||
              (ACCOUNTING_LIST_PATHS.has(pathname) && col.key === "reference_number")
            ) {
              if (pathname === "/en/item-config/price-list") {
                router.push(`/en/item-config/price-list-details/${row.id}`);
                return;
              }
              const base = DETAILS_HREF[pathname];
              if (!base) return;
              if (ACCOUNTING_LIST_PATHS.has(pathname)) {
                router.push(`${base}?id=${row.id}`);
                return;
              }
              router.push(`${base}/${row.id}`);
            }
          }}
        />
      )}

      {modalCfg?.emailTemplate ? (
        <EmailTemplateModal
          open={Boolean(modal)}
          mode={modal?.mode === "edit" ? "edit" : "create"}
          values={form}
          onChange={(key, val) => setForm((prev) => ({ ...prev, [key]: val }))}
          onClose={() => setModal(null)}
          onSave={onSave}
        />
      ) : (
        modalCfg && (
          <EntityFormModal
            open={Boolean(modal)}
            title={modal?.mode === "edit" ? modalCfg.editTitle : modalCfg.title}
            fields={modalCfg.fields}
            values={form}
            imageLabel={modalCfg.imageLabel}
            onChange={(key, val) => setForm((prev) => ({ ...prev, [key]: val }))}
            onClose={() => setModal(null)}
            onSave={onSave}
          />
        )
      )}

      {batchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h3 className="m-0 text-[16px] font-semibold text-[#1a557a]">
              {batchModal === "office-time" ? "Change Office Time" : "Assign Weekend"}
            </h3>
            <p className="mt-1 text-[12px] text-slate-500">
              Applying to {selectedIds.length} selected employee
              {selectedIds.length > 1 ? "s" : ""}.
            </p>

            {batchModal === "office-time" ? (
              <div className="mt-4">
                <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
                  Working Shift
                </label>
                <select
                  value={batchShift}
                  onChange={(e) => setBatchShift(e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                >
                  {WORKING_SHIFTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {WEEKEND_DAYS.map((day) => {
                  const checked = batchWeekends.includes(day);
                  return (
                    <label
                      key={day}
                      className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-[13px] text-slate-700"
                    >
                      <input
                        type="checkbox"
                        className="accent-[#00a78b]"
                        checked={checked}
                        onChange={() =>
                          setBatchWeekends((prev) =>
                            checked ? prev.filter((d) => d !== day) : [...prev, day]
                          )
                        }
                      />
                      {day}
                    </label>
                  );
                })}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBatchModal(null)}
                className="h-9 rounded border border-slate-200 px-4 text-[13px] text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setRows((prev) =>
                    prev.map((r) => {
                      if (!selectedIds.includes(r.id)) return r;
                      if (batchModal === "office-time") return { ...r, shift: batchShift };
                      return { ...r, weekends: [...batchWeekends] };
                    })
                  );
                  setBatchModal(null);
                  setSelectedIds([]);
                }}
                className="h-9 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
