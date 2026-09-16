"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { purchaseApi, salesApi, unwrapApiData } from "../../lib/api";

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase();
  let cls = "bg-slate-400 text-white";
  if (["active", "approved", "completed", "paid", "delivered", "verified", "refunded"].includes(v))
    cls = "bg-[#28a745] text-white";
  else if (["draft", "pending", "partial", "partially paid", "unpaid", "not invoiced"].includes(v))
    cls = "bg-[#ffc107] text-[#212529]";
  else if (["inactive", "cancelled", "rejected"].includes(v))
    cls = "bg-[#dc3545] text-white";

  if (v === "delivered") cls = "bg-[#fd7e14] text-white";

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

function SectionTitle({ children }) {
  return <h3 className="mb-3 mt-6 text-[16px] font-semibold text-[#2c3e50]">{children}</h3>;
}

function EmptyRelated({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-6 text-center text-[13px] text-slate-400">
        No data available!
      </td>
    </tr>
  );
}

const BACK_HREF_TO_SALES_API = {
  "/en/sales/sales-direct-sales": "directInvoices",
  "/en/sales/quotation-list": "quotations",
  "/en/sales/sales-orders": "orders",
  "/en/sales/sales-deliveries": "deliveries",
  "/en/sales/sales-invoices": "invoices",
  "/en/sales/sales-returns": "returns",
  "/en/sales/batch-payments": "batchPayments",
  "/en/sales/sales-payments": "payments",
  "/en/sales/customer-debits": "customerDebits",
  "/en/sales/refunds": "refunds",
};

const BACK_HREF_TO_PURCHASE_API = {
  "/en/purchase/direct-purchases": "directBills",
  "/en/purchase/requisitions": "requisitions",
  "/en/purchase/orders": "orders",
  "/en/purchase/receipts": "receipts",
  "/en/purchase/bills": "bills",
  "/en/purchase/returns": "returns",
  "/en/purchase/batch-payments": "batchPayments",
  "/en/purchase/payments": "payments",
  "/en/purchase/supplier-credits": "supplierCredits",
  "/en/purchase/refunds": "refunds",
};

function resolveSalesApi(config) {
  const key = config?.salesApiKey || BACK_HREF_TO_SALES_API[config?.backHref] || null;
  return key ? salesApi[key] : null;
}

function resolvePurchaseApi(config) {
  const key =
    config?.purchaseApiKey || BACK_HREF_TO_PURCHASE_API[config?.backHref] || null;
  return key ? purchaseApi[key] : null;
}

function money(n) {
  if (n == null || n === "") return "৳ 0";
  if (typeof n === "string" && n.includes("৳")) return n;
  return `৳ ${Number(n).toLocaleString()}`;
}

function mapDocToView(doc, config, isPurchase) {
  if (!doc) return null;
  const unit = (line) => line.unit || "pc";
  return {
    id: doc.id,
    orderNumber:
      doc.document_number ||
      doc.order_number ||
      doc.quotation_number ||
      doc.invoice_number ||
      doc.delivery_number ||
      doc.return_number ||
      doc.payment_number ||
      doc.batch_number ||
      doc.credit_number ||
      doc.refund_number ||
      doc.requisition_number ||
      doc.receipt_number ||
      doc.bill_number ||
      "—",
    date:
      doc.document_date_formatted ||
      doc.sale_date ||
      doc.quotation_date ||
      doc.date ||
      doc.delivery_date ||
      doc.return_date ||
      doc.document_date ||
      "—",
    type: config?.txnType || (isPurchase ? "Direct Purchase" : "Sales Document"),
    salesPerson: doc.sales_person || doc.purchased_by || doc.created_by || "—",
    status: doc.status || doc.order_status || "—",
    customer: isPurchase
      ? doc.supplier || doc.supplier_name || doc.customer || "—"
      : doc.customer || "—",
    customerPhone: isPurchase
      ? doc.supplier_phone || doc.customer_phone || "—"
      : doc.customer_phone || "—",
    company: {
      name: "Demo Biznify",
      email: "dev.biznify@softifybd.com",
      phone: "8801722222222",
      address: "Softifybd",
    },
    lines: (doc.lines || []).map((line) => ({
      id: line.id,
      item: line.item || line.item_name || "Item",
      meta: line.meta || "",
      orderedQty: `${line.quantity ?? 0} ${unit(line)}`,
      billedQty: `${line.quantity ?? 0} ${unit(line)}`,
      deliveredQty: `${line.quantity ?? 0} ${unit(line)}`,
      returnedQty: `0 ${unit(line)}`,
      price: line.unit_price_formatted || money(line.unit_price),
      discount: line.discount ? money(line.discount) : "N/A",
      amount: line.line_total_formatted || money(line.line_total),
    })),
    grandTotal: doc.grand_total_formatted || money(doc.grand_total),
    deliveries: [],
    invoices: [],
    receipts: [],
    bills: [],
    returns: [],
    notes: doc.note || doc.description || "",
    raw: doc,
  };
}

export default function TransactionDetailsPage({ config, record }) {
  const router = useRouter();
  const isPurchase =
    config?.relatedMode === "purchase" ||
    config?.module === "Purchase" ||
    Boolean(config?.purchaseApiKey);
  const isSales = config?.module === "Sales" && !isPurchase;
  const api = isSales
    ? resolveSalesApi(config)
    : isPurchase
      ? resolvePurchaseApi(config)
      : null;
  const usesApi = Boolean(api);

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(Boolean(usesApi && record?.id));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!usesApi || !api || !record?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .get(record.id)
      .then((res) => {
        if (!cancelled) setDoc(unwrapApiData(res));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [usesApi, api, record?.id]);

  const data = useMemo(() => {
    if (usesApi && doc) return mapDocToView(doc, config, isPurchase);
    if (usesApi) return null;

    return {
      orderNumber: isPurchase ? "DP-000670" : "DSO-001000",
      date: "6 Sep 2026",
      type: isPurchase ? "Direct Purchase" : "Direct Sale",
      salesPerson: "Demo",
      status: "Completed",
      customer: isPurchase ? "Rahim" : "Walk in Customer.",
      customerPhone: "01700000000",
      company: {
        name: "Demo Biznify",
        email: "dev.biznify@softifybd.com",
        phone: "8801722222222",
        address:
          "Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd, Softifybd",
      },
      lines: [
        {
          id: 1,
          item: "Sample Item",
          meta: "M: Default, B: Default",
          orderedQty: "1 pc",
          billedQty: "1 pc",
          deliveredQty: "1 pc",
          returnedQty: "0 pc",
          price: "৳ 100",
          discount: "N/A",
          amount: "৳ 100",
        },
      ],
      grandTotal: "৳ 100",
      deliveries: [],
      invoices: [],
      receipts: [],
      bills: [],
      returns: [],
      notes: "",
      ...config?.initialValues,
      ...record,
    };
  }, [usesApi, doc, config, record, isPurchase]);

  const backHref =
    config?.backHref ||
    (isPurchase ? "/en/purchase/direct-purchases" : "/en/sales/sales-direct-sales");
  const editHref =
    config?.editHref ||
    (isPurchase ? "/en/purchase/direct-purchase-create" : "/en/sales/sales-direct-sale-create");
  const partyByLabel = config?.partyLabel || (isPurchase ? "Order by" : "Order by");
  const signatureLabel = isPurchase ? "Signature of Supplier" : "Signature of Customer";
  const personLabel = isPurchase ? "Purchased By" : "Sales Person";
  const relatedReceiptTitle = isPurchase ? "Related Receipts" : "Related Deliveries";
  const relatedBillTitle = isPurchase ? "Related Bills" : "Related Invoices";
  const relatedReceipts = isPurchase ? data?.receipts || [] : data?.deliveries || [];
  const relatedBills = isPurchase ? data?.bills || [] : data?.invoices || [];

  const status = String(data?.status || "").toLowerCase();
  const canEdit = !usesApi || status === "draft";
  const canCancel =
    usesApi &&
    api?.cancel &&
    ((isSales && config?.salesApiKey === "directInvoices") ||
      (isPurchase && config?.purchaseApiKey === "directBills")) &&
    ["draft", "completed"].includes(status);

  const canConvertToOrder =
    usesApi &&
    ((isSales && config?.salesApiKey === "quotations") ||
      (isPurchase && config?.purchaseApiKey === "requisitions")) &&
    status === "approved";
  const canConvertToDelivery =
    isSales &&
    usesApi &&
    config?.salesApiKey === "orders" &&
    (status === "approved" || String(doc?.order_status || "").toLowerCase() === "approved");
  const canConvertToInvoice = canConvertToDelivery;
  const canConvertToReceipt =
    isPurchase &&
    usesApi &&
    config?.purchaseApiKey === "orders" &&
    (status === "approved" || String(doc?.order_status || "").toLowerCase() === "approved");
  const canConvertToBill = canConvertToReceipt;

  const runAction = async (fn, redirectHref) => {
    if (!data?.id) return;
    setBusy(true);
    setError("");
    try {
      await fn(data.id);
      if (redirectHref) router.push(redirectHref);
      else {
        const res = await api.get(data.id);
        setDoc(unwrapApiData(res));
      }
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  if ((usesApi && (error || !data)) || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        {error || "Record not found."}{" "}
        <Link href={backHref} className="font-semibold underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#2c3e50]">{data.orderNumber}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {config?.editHref && canEdit && (
            <Link
              href={`${editHref}?id=${data.id}`}
              className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8]"
            >
              Edit
            </Link>
          )}
          {canCancel && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (
                  !window.confirm(
                    isPurchase
                      ? "Cancel this direct bill?"
                      : "Cancel this direct invoice?"
                  )
                )
                  return;
                runAction((id) => api.cancel(id), backHref);
              }}
              className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8] disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          {canConvertToOrder && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                runAction(
                  (id) =>
                    isPurchase
                      ? purchaseApi.requisitions.convertToOrder(id)
                      : salesApi.quotations.convertToOrder(id),
                  isPurchase ? "/en/purchase/orders" : "/en/sales/sales-orders"
                )
              }
              className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
            >
              Convert to Order
            </button>
          )}
          {canConvertToDelivery && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                runAction(
                  (id) => salesApi.orders.convertToDelivery(id),
                  "/en/sales/sales-deliveries"
                )
              }
              className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
            >
              Convert to Delivery
            </button>
          )}
          {canConvertToInvoice && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                runAction(
                  (id) => salesApi.orders.convertToInvoice(id),
                  "/en/sales/sales-invoices"
                )
              }
              className="inline-flex h-9 items-center rounded bg-[#5dade2] px-4 text-[13px] font-medium text-white hover:bg-[#3498db] disabled:opacity-50"
            >
              Convert to Invoice
            </button>
          )}
          {canConvertToReceipt && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                runAction(
                  (id) => purchaseApi.orders.convertToReceipt(id),
                  "/en/purchase/receipts"
                )
              }
              className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
            >
              Convert to Receipt
            </button>
          )}
          {canConvertToBill && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                runAction(
                  (id) => purchaseApi.orders.convertToBill(id),
                  "/en/purchase/bills"
                )
              }
              className="inline-flex h-9 items-center rounded bg-[#5dade2] px-4 text-[13px] font-medium text-white hover:bg-[#3498db] disabled:opacity-50"
            >
              Convert to Bill
            </button>
          )}
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77]"
          >
            <span className="material-icons text-[16px]">print</span>
            Print
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded bg-[#5dade2] px-4 text-[13px] font-medium text-white hover:bg-[#3498db]"
          >
            <span className="material-icons text-[16px]">picture_as_pdf</span>
            PDF
          </button>
        </div>
      </div>

      {error && usesApi && data && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#00a78b] text-[28px] font-bold text-white">
            b
          </div>
          <div className="max-w-xl text-right text-[12px] leading-5 text-slate-600">
            <div className="font-semibold text-[#2c3e50]">{data.company.name}</div>
            <div>{data.company.email}</div>
            <div>{data.company.phone}</div>
            <div className="mt-1 break-words">{data.company.address}</div>
          </div>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-1 text-[13px] text-slate-500">{partyByLabel}:</div>
            <div className="text-[14px] font-medium text-[#00a78b]">{data.customer}</div>
            <div className="text-[13px] text-slate-600">{data.customerPhone}</div>
          </div>
          <div className="space-y-1.5 text-[13px] md:text-right">
            <div>
              <span className="text-slate-500">Order Number : </span>
              <span className="font-medium text-[#2c3e50]">{data.orderNumber}</span>
            </div>
            <div>
              <span className="text-slate-500">Date : </span>
              <span className="font-medium text-[#2c3e50]">{data.date}</span>
            </div>
            <div>
              <span className="text-slate-500">Type : </span>
              <span className="font-medium text-[#2c3e50]">{data.type}</span>
            </div>
            <div>
              <span className="text-slate-500">{personLabel} : </span>
              <span className="font-medium text-[#2c3e50]">{data.salesPerson}</span>
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              <span className="text-slate-500">Status : </span>
              <StatusPill value={data.status} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-left text-[13px]">
            <thead className="bg-[#eef5fa] text-[11px] font-semibold uppercase tracking-wide text-[#1a557a]">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Item & Description</th>
                <th className="px-3 py-2">Ordered Qty</th>
                <th className="px-3 py-2">Billed Qty</th>
                <th className="px-3 py-2">Delivered Qty</th>
                <th className="px-3 py-2">Returned Qty</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Discount</th>
                <th className="px-3 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(data.lines || []).length === 0 ? (
                <EmptyRelated colSpan={9} />
              ) : (
                (data.lines || []).map((line, idx) => (
                  <tr key={line.id || idx} className="border-t border-slate-100">
                    <td className="px-3 py-3 text-slate-600">{idx + 1}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-[#2c3e50]">{line.item}</div>
                      {line.meta && (
                        <div className="mt-0.5 text-[12px] text-slate-500">{line.meta}</div>
                      )}
                    </td>
                    <td className="px-3 py-3">{line.orderedQty}</td>
                    <td className="px-3 py-3">{line.billedQty}</td>
                    <td className="px-3 py-3">{line.deliveredQty}</td>
                    <td className="px-3 py-3">{line.returnedQty}</td>
                    <td className="px-3 py-3">{line.price}</td>
                    <td className="px-3 py-3">{line.discount}</td>
                    <td className="px-3 py-3 font-medium">{line.amount}</td>
                  </tr>
                ))
              )}
              <tr className="border-t border-slate-200 bg-slate-50">
                <td colSpan={8} className="px-3 py-3 text-right font-semibold text-[#2c3e50]">
                  Grand Total
                </td>
                <td className="px-3 py-3 font-semibold text-[#2c3e50]">{data.grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SectionTitle>{relatedReceiptTitle}</SectionTitle>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-left text-[13px]">
            <thead className="bg-[#1a6aa8] text-[11px] font-semibold uppercase tracking-wide text-white">
              <tr>
                <th className="px-3 py-2">{isPurchase ? "Receipt Number" : "Delivery Number"}</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">{isPurchase ? "Receipt Type" : "Delivery Type"}</th>
                <th className="px-3 py-2">{isPurchase ? "Receipt Status" : "Delivery Status"}</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {relatedReceipts.length === 0 ? (
                <EmptyRelated colSpan={5} />
              ) : (
                relatedReceipts.map((d) => (
                  <tr key={d.number} className="border-t border-slate-100">
                    <td className="px-3 py-2.5">
                      <span className="text-[#00a78b]">{d.number}</span>
                    </td>
                    <td className="px-3 py-2.5">{d.date}</td>
                    <td className="px-3 py-2.5">{d.type}</td>
                    <td className="px-3 py-2.5">
                      <StatusPill value={d.status} />
                    </td>
                    <td className="px-3 py-2.5">
                      <button type="button" className="text-slate-500" aria-label="Actions">
                        <span className="material-icons text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <SectionTitle>{relatedBillTitle}</SectionTitle>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-left text-[13px]">
            <thead className="bg-[#1a6aa8] text-[11px] font-semibold uppercase tracking-wide text-white">
              <tr>
                <th className="px-3 py-2">{isPurchase ? "Bill Number" : "Invoice Number"}</th>
                <th className="px-3 py-2">{isPurchase ? "Bill Date" : "Invoice Date"}</th>
                <th className="px-3 py-2">Paid</th>
                <th className="px-3 py-2">Due</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {relatedBills.length === 0 ? (
                <EmptyRelated colSpan={7} />
              ) : (
                relatedBills.map((inv) => (
                  <tr key={inv.number} className="border-t border-slate-100">
                    <td className="px-3 py-2.5">
                      <span className="text-[#00a78b]">{inv.number}</span>
                    </td>
                    <td className="px-3 py-2.5">{inv.date}</td>
                    <td className="px-3 py-2.5">{inv.paid}</td>
                    <td className="px-3 py-2.5">{inv.due}</td>
                    <td className="px-3 py-2.5">{inv.total}</td>
                    <td className="px-3 py-2.5">
                      <StatusPill value={inv.status} />
                    </td>
                    <td className="px-3 py-2.5">
                      <button type="button" className="text-slate-500" aria-label="Actions">
                        <span className="material-icons text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <SectionTitle>Related Returns</SectionTitle>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-left text-[13px]">
            <thead className="bg-[#1a6aa8] text-[11px] font-semibold uppercase tracking-wide text-white">
              <tr>
                <th className="px-3 py-2">Return Number</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Return Date</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <EmptyRelated colSpan={5} />
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-6 border-t border-slate-100 pt-5 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[13px] font-medium text-slate-600">Notes :</div>
            <div className="min-h-[60px] text-[13px] text-slate-500">{data.notes || "—"}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center text-[12px] text-slate-500">
            <div className="border-t border-slate-300 pt-8">{signatureLabel}</div>
            <div className="border-t border-slate-300 pt-8">Authorized Signature</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link href={backHref} className="text-[13px] text-[#00a78b] hover:underline">
          ← Back to list
        </Link>
      </div>
    </div>
  );
}
