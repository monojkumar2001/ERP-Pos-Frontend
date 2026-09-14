"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import SummaryCards from "./SummaryCards";
import FilterBar from "./FilterBar";
import DataTable from "./DataTable";
import EntityFormModal from "./EntityFormModal";
import { api } from "../../lib/api";

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
    editTitle: "Update Customer Type",
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
};

const PATH_ACTIONS = {
  "/en/item-config/items": ["details", "edit", "inactive", "delete", "edit-opening-stock"],
  "/en/item-config/price-list": ["details", "edit", "deactivate", "delete"],
  "/en/pos/outlets": ["edit", "inactive"],
  "/en/sales/customers": ["details", "edit", "inactive"],
  "/en/sales/sales-direct-sales": ["details", "edit", "cancel"],
  "/en/sales/quotation-list": ["details", "edit", "approve", "delete"],
  "/en/sales/sales-orders": ["details", "edit", "approve", "delete"],
  "/en/sales/sales-deliveries": ["details", "edit", "delete"],
  "/en/sales/sales-invoices": ["details", "edit", "delete"],
  "/en/sales/sales-returns": ["details", "edit", "delete"],
  "/en/sales/batch-payments": ["details", "delete"],
  "/en/sales/sales-payments": ["details", "edit", "delete"],
  "/en/sales/customer-debits": ["details", "edit", "approve", "delete"],
  "/en/sales/refunds": ["details", "edit", "delete"],
};

function toggleStatus(row) {
  return String(row.status).toLowerCase() === "inactive" ||
    String(row.status).toLowerCase() === "deactivated"
    ? "Active"
    : "Inactive";
}

export default function ListPage({ config, pathname }) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);
  const [rows, setRows] = useState(config?.rows || []);
  const [totalEntries, setTotalEntries] = useState(config?.totalEntries);
  const [totalAmount, setTotalAmount] = useState(config?.totalAmount);
  const [loading, setLoading] = useState(Boolean(config?.apiEndpoint));
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const modalCfg = ITEM_MODALS[pathname] || config?.modal || null;

  useEffect(() => {
    if (!config?.apiEndpoint) {
      setRows(config?.rows || []);
      setTotalEntries(config?.totalEntries);
      setTotalAmount(config?.totalAmount);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    api(config.apiEndpoint)
      .then((data) => {
        if (cancelled) return;
        setRows(data.rows || []);
        setTotalEntries(data.totalEntries ?? (data.rows || []).length);
        setTotalAmount(data.totalAmount);
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
  }, [config?.apiEndpoint, config?.title]);

  const openAdd = () => {
    if (!modalCfg) return;
    const initial = {};
    modalCfg.fields.forEach((f) => {
      initial[f.key] = f.type === "repeating" ? [""] : "";
    });
    setForm(initial);
    setModal({ mode: "add" });
  };

  const openEdit = (row) => {
    if (!modalCfg) return;
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

  const onSave = () => {
    const nameKey = modalCfg.nameKey || modalCfg.fields[0]?.key;
    if (nameKey && !String(form[nameKey] || "").trim()) return;
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
        onClick: (row) => {
          if (pathname === "/en/item-config/price-list") {
            router.push(`/en/item-config/price-list-details/${row.id}`);
            return;
          }
          if (pathname === "/en/sales/customers") {
            router.push(`/en/sales/customer-create?id=${row.id}&mode=details`);
            return;
          }
          if (pathname === "/en/sales/sales-direct-sales") {
            router.push(`/en/sales/sales-direct-sale-details/${row.id}`);
          }
        },
      },
      edit: {
        key: "edit",
        label: "Edit",
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
          if (pathname === "/en/sales/customers") {
            router.push(`/en/sales/customer-create?id=${row.id}`);
            return;
          }
          if (pathname === "/en/sales/sales-direct-sales") {
            router.push("/en/sales/sales-direct-sale-create");
          }
        },
      },
      inactive: {
        key: "inactive",
        label: (row) =>
          String(row.status).toLowerCase() === "inactive" ? "Make Active" : "Make Inactive",
        onClick: (row) => setStatus(row, toggleStatus(row)),
      },
      deactivate: {
        key: "deactivate",
        label: (row) =>
          String(row.status).toLowerCase() === "inactive" ||
          String(row.status).toLowerCase() === "deactivated"
            ? "Activate"
            : "Deactivate",
        onClick: (row) => setStatus(row, toggleStatus(row)),
      },
      "add-discount": {
        key: "add-discount",
        label: "Add Discount",
        onClick: (row) => setDiscount(row, "5%"),
      },
      "remove-discount": {
        key: "remove-discount",
        label: "Remove Discount",
        getDisabled: (row) => !row.discount || row.discount === "N/A",
        onClick: (row) => setDiscount(row, "N/A"),
      },
      "edit-opening-stock": {
        key: "edit-opening-stock",
        label: "Edit Opening Stock",
      },
      cancel: {
        key: "cancel",
        label: "Cancel",
        onClick: (row) => setStatus(row, "Cancelled"),
      },
      approve: {
        key: "approve",
        label: "Approve",
        onClick: (row) => setStatus(row, "Approved"),
      },
      delete: {
        key: "delete",
        label: "Delete",
        onClick: (row) => {
          setRows((prev) => prev.filter((r) => r.id !== row.id));
          setTotalEntries((n) => Math.max(0, (n || rows.length) - 1));
        },
      },
    };

    return actionKeys.map((k) => defs[k]).filter(Boolean);
  }, [actionKeys.join("|"), !!modalCfg, rows.length, pathname, router]);

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
          ].includes(pathname)
        }
      />
      <SummaryCards cards={config.summaryCards || []} />
      {showFilters && <FilterBar filters={config.filters || []} />}
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
        />
      )}

      {modalCfg && (
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
      )}
    </div>
  );
}
