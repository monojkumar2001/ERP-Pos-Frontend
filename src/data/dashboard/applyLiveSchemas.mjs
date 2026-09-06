/**
 * Applies liveListSchemas.json into pageConfigs by writing liveOverrides.generated.js
 * Usage: node src/data/dashboard/applyLiveSchemas.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemasPath = path.join(__dirname, "liveListSchemas.json");
const outPath = path.join(__dirname, "liveOverrides.generated.js");

function keyFromLabel(label) {
  return String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function colFromHeader(label, idx) {
  if (label === "ACTION") return { key: "action", label, type: "action" };
  if (label === "STATUS") return { key: "status", label, type: "status" };
  const key = keyFromLabel(label) || `col_${idx}`;
  const linkish =
    /NUMBER|NO\.?$|^NAME$|REFERENCE|INVOICE|ORDER|QUOTATION|BILL|^CODE$|^SKU$/i.test(
      label
    ) && idx <= 1;
  return linkish ? { key, label, type: "link" } : { key, label };
}

function filtersFromSchema(s) {
  const filters = [];
  const seen = new Set();
  for (const sel of s.ngSelects || []) {
    const ph = sel.ph || "Select";
    if (seen.has(ph)) continue;
    seen.add(ph);
    if (sel.multi) {
      filters.push({
        key: keyFromLabel(ph) || "status",
        label: ph,
        type: "multiselect",
        placeholder: ph,
        options: sel.values?.length ? sel.values : ["Approved", "Draft"],
        defaultValue: sel.values?.length ? [...sel.values] : [],
      });
    } else if (/range/i.test(ph)) {
      filters.push({
        key: "range",
        label: ph,
        placeholder: ph,
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
      });
    } else {
      filters.push({
        key: keyFromLabel(ph),
        label: ph,
        placeholder: ph,
      });
    }
  }
  for (const ph of s.placeholders || []) {
    if (seen.has(ph)) continue;
    if (/from date/i.test(ph)) {
      seen.add(ph);
      filters.push({ key: "from", label: ph, type: "date", placeholder: ph });
    } else if (/to date/i.test(ph)) {
      seen.add(ph);
      filters.push({ key: "to", label: ph, type: "date", placeholder: ph });
    }
  }
  return filters;
}

function parseTotalEntries(footer) {
  const m = String(footer || "").match(/of\s+([\d,]+)\s+entries/i);
  return m ? Number(m[1].replace(/,/g, "")) : undefined;
}

function parseTotalAmount(totalAmt) {
  if (!totalAmt) return undefined;
  // Prefer last ৳ amount on multi-total footers, else first
  const matches = String(totalAmt).match(/৳\s*[\d,]+(?:\.\d+)?/g);
  if (!matches?.length) return undefined;
  return matches[matches.length - 1];
}

function rowsFromSchema(s, columns) {
  const samples = (s.firstRows || []).map((cells, i) => {
    const row = { id: i + 1 };
    columns.forEach((c, idx) => {
      if (c.type === "checkbox" || c.type === "action") return;
      row[c.key] = cells[idx] ?? "";
    });
    return row;
  });
  const target = Math.min(25, Math.max(samples.length, parseTotalEntries(s.footer) || 12, 12));
  const out = [...samples];
  while (out.length < target) {
    const i = out.length;
    const row = { id: i + 1 };
    columns.forEach((c) => {
      if (c.type === "checkbox" || c.type === "action") return;
      if (c.type === "status") {
        row[c.key] = (s.statuses || ["Active"])[i % (s.statuses?.length || 1)];
      } else if (/amount|total|due|price|paid/i.test(c.key)) {
        row[c.key] = `৳ ${(500 + i * 137).toLocaleString()}`;
      } else if (/date/i.test(c.key)) {
        row[c.key] = `${(i % 28) + 1} Jan 2026`;
      } else if (/time/i.test(c.key)) {
        row[c.key] = `${String(9 + (i % 10)).padStart(2, "0")}:00 AM`;
      } else if (/reference|number|no/i.test(c.key)) {
        row[c.key] = `REF-2026-${String(1000 + i).padStart(8, "0")}`;
      } else {
        row[c.key] = `${c.label.split(" ")[0]} ${i + 1}`;
      }
    });
    out.push(row);
  }
  return out;
}

export function schemaToOverride(s) {
  if (!s?.ths?.length) return null;
  let headers = [...s.ths];
  if (s.hasCheckbox && headers[0] !== "") headers = ["", ...headers];
  const columns = headers.map((label, idx) => {
    if (s.hasCheckbox && idx === 0 && !label) {
      return { key: "_check", label: "", type: "checkbox" };
    }
    return colFromHeader(label, idx);
  });
  const amountCol = columns.find((c) => /amount|total/i.test(c.key));
  const filters = filtersFromSchema(s);
  return {
    title: s.title || undefined,
    addLabel: s.addBtn || undefined,
    hideFilterToggle: true,
    filters,
    columns,
    totalEntries: parseTotalEntries(s.footer),
    totalAmount: parseTotalAmount(s.totalAmt),
    amountKey: amountCol?.key,
    _rows: rowsFromSchema(s, columns),
  };
}

function main() {
  const schemas = JSON.parse(fs.readFileSync(schemasPath, "utf8"));
  const overrides = {};
  const rowsMap = {};
  let ok = 0;
  for (const [p, s] of Object.entries(schemas)) {
    const o = schemaToOverride(s);
    if (!o) continue;
    const { _rows, ...rest } = o;
    overrides[p] = rest;
    rowsMap[p] = _rows;
    ok++;
  }

  const file = JSON.stringify({ overrides, rows: rowsMap }, null, 2);
  fs.writeFileSync(path.join(__dirname, "liveOverrides.generated.json"), file);
  console.log(`Generated ${ok} overrides -> liveOverrides.generated.json`);
}

main();
