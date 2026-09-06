/**
 * Converts liveListSchemas.json scrape output into list page override shapes.
 * Run after scrape: node src/data/dashboard/buildOverridesFromLive.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemasPath = path.join(__dirname, "liveListSchemas.json");

function keyFromLabel(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function colFromHeader(label, idx, row0 = []) {
  const key = keyFromLabel(label) || `col_${idx}`;
  const sample = row0[idx] || "";
  if (label === "ACTION") return { key: "action", label, type: "action" };
  if (label === "STATUS") return { key: "status", label, type: "status" };
  if (!label && idx === 0) return { key: "_check", label: "", type: "checkbox" };

  const linkish =
    /NUMBER|NO\.?$|NAME|REFERENCE|INVOICE|ORDER|QUOTATION|BILL|CODE|SKU/i.test(label) &&
    idx <= 1;
  const type = linkish ? "link" : undefined;
  return type ? { key, label, type } : { key, label };
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
        defaultValue: sel.values?.length ? sel.values : [],
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
        options: ["Option 1", "Option 2"],
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
  const m = String(totalAmt).match(/৳\s*[\d,]+(?:\.\d+)?/);
  return m ? m[0] : undefined;
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

  const count = Math.min(25, parseTotalEntries(s.footer) || 15);
  const out = [...samples];
  while (out.length < count) {
    const i = out.length;
    const base = { id: i + 1 };
    columns.forEach((c) => {
      if (c.type === "checkbox" || c.type === "action") return;
      if (c.type === "status") {
        base[c.key] = (s.statuses || ["Active"])[i % (s.statuses?.length || 1)];
      } else if (/amount|total|due|price/i.test(c.key)) {
        base[c.key] = `৳ ${(1000 * (i + 1)).toLocaleString()}`;
      } else if (/date/i.test(c.key)) {
        base[c.key] = `${(i % 28) + 1} Jan 2026`;
      } else if (/time/i.test(c.key)) {
        base[c.key] = `${10 + (i % 8)}:00 AM`;
      } else {
        base[c.key] = `${c.label.split(" ")[0]} ${i + 1}`;
      }
    });
    out.push(base);
  }
  return out;
}

export function schemaToOverride(s) {
  if (!s?.ths?.length) return null;
  const row0 = s.firstRows?.[0] || [];
  let headers = [...s.ths];
  if (s.hasCheckbox && headers[0] !== "") {
    headers = ["", ...headers];
  }

  const columns = headers.map((label, idx) => {
    if (s.hasCheckbox && idx === 0 && !label) {
      return { key: "_check", label: "", type: "checkbox" };
    }
    return colFromHeader(label, idx, row0);
  });

  const amountCol = columns.find((c) => /amount|total/i.test(c.key));
  const filters = filtersFromSchema(s);
  const totalEntries = parseTotalEntries(s.footer);
  const totalAmount = parseTotalAmount(s.totalAmt);

  return {
    title: s.title || undefined,
    addLabel: s.addBtn || undefined,
    hideFilterToggle: filters.length > 0,
    filters,
    columns,
    totalEntries,
    totalAmount,
    amountKey: amountCol?.key,
    rows: rowsFromSchema(s, columns),
  };
}

if (process.argv[1] && process.argv[1].includes("buildOverridesFromLive")) {
  if (!fs.existsSync(schemasPath)) {
    console.error("Missing liveListSchemas.json — scrape first");
    process.exit(1);
  }
  const schemas = JSON.parse(fs.readFileSync(schemasPath, "utf8"));
  const overrides = {};
  let ok = 0;
  let skip = 0;
  for (const [p, s] of Object.entries(schemas)) {
    const o = schemaToOverride(s);
    if (o) {
      overrides[p] = o;
      ok++;
    } else skip++;
  }
  const outPath = path.join(__dirname, "generatedOverrides.json");
  fs.writeFileSync(outPath, JSON.stringify(overrides, null, 2));
  console.log(`Wrote ${ok} overrides (${skip} skipped) -> ${outPath}`);
}
