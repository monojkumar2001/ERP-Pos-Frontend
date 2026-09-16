const actionCol = { key: "action", label: "ACTION", type: "action" };
const statusCol = { key: "status", label: "STATUS", type: "status" };

export const MFG_ITEMS = [
  "Jersey | Manufactured Item",
  "Charizma Summer Lawn - Red | 42",
  "2 Core Fiber_Fiber Solution",
  "2 Port TJ (Cap)",
  "সয়াবিন তেল - ৫ লিটার",
  "Radical - 1000 ml",
  "Chicken Biryani",
  "Bread",
  "Iron stick",
  "Cotton Fabrics",
  "Pusti Happy Noodles",
  "BSF sardin",
];

export const MFG_CUSTOMERS = ["N/A", "MIzan", "Sakib", "POS CUSTOMER", "নিজাম মিয়া"];

export const MFG_TEAMS = [
  "Key Manager 1",
  "green",
  "Mango Juice team",
  "Distribution team",
  "Manufacture team",
  "Ice Team",
  "Helium",
];

export const MFG_PEOPLE = [
  "Ibrahim",
  "Showmik Hossain",
  "Nazmul Hossain",
  "Anamul Haque Shahin",
  "RED",
  "Jahedul Islam",
  "Sujit Kumar Biswas",
  "Tanvir",
  "Bijon Shikder",
  "Md. Akram Hossain Niloy",
];

const PLAN_SAMPLES = [
  ["Jersey | Manufactured Item", "PRP-2026-000044", "BIN 15200-2026-000044", "10", "100", "1 Sep 2026", "30 Sep 2026", "Ibrahim", "Approved"],
  ["Jersey | Manufactured Item", "PRP-2026-000043", "BIN 15200-2026-000043", "1", "1500", "1 Sep 2026", "30 Sep 2026", "Showmik Hossain", "Approved"],
  ["Jersey | Manufactured Item", "PRP-2026-000042", "BIN 15200-2026-000042", "1", "1500", "1 Sep 2026", "30 Sep 2026", "Showmik Hossain", "Approved"],
  ["Jersey | Manufactured Item", "PRP-2026-000041", "BIN 15200-2026-000041", "1", "1500", "1 Sep 2026", "30 Sep 2026", "Showmik Hossain", "Approved"],
  ["Charizma Summer Lawn - Red | 42", "PRP-2026-000040", "BIN 15200-2026-000040", "11", "1418.18", "9 Sep 2026", "9 Sep 2026", "Nazmul Hossain", "Approved"],
  ["2 Core Fiber_Fiber Solution", "PRP-2026-000039", "BIN 15200-2026-000039", "11", "545.45", "9 Sep 2026", "9 Sep 2026", "Anamul Haque Shahin", "Approved"],
  ["2 Port TJ (Cap)", "PRP-2026-000038", "BIN 15200-2026-000038", "12", "366.67", "9 Sep 2026", "9 Sep 2026", "Anamul Haque Shahin", "Approved"],
  ["সয়াবিন তেল - ৫ লিটার", "PRP-2026-000037", "BIN 15200-2026-000037", "5", "988.01", "9 Sep 2026", "11 Sep 2026", "RED", "Approved"],
  ["Radical - 1000 ml", "PRP-2026-000036", "BIN 15200-2026-000036", "50", "52", "2 Sep 2026", "10 Sep 2026", "Nazmul Hossain", "Approved"],
  ["Chicken Biryani", "PRP-2026-000035", "BIN 15200-2026-000035", "150", "16.08", "4 Aug 2026", "20 Aug 2026", "Jahedul Islam", "Approved"],
  ["Bread", "PRP-2026-000034", "BIN 15200-2026-000034", "100", "0.01", "9 Aug 2026", "11 Aug 2026", "Nazmul Hossain", "Approved"],
  ["Chicken Biryani", "PRP-2026-000033", "BIN 15200-2026-000033", "200", "127.5", "3 Aug 2026", "3 Aug 2026", "Sujit Kumar Biswas", "Approved"],
];

function padRows(samples, mapper, total, extra) {
  const rows = samples.map(mapper);
  while (rows.length < Math.min(25, total)) {
    const i = rows.length;
    rows.push(extra(i));
  }
  return rows;
}

const itemFilter = {
  key: "items",
  label: "Select Items",
  placeholder: "Select Items",
  options: MFG_ITEMS,
};

const statusFilter = {
  key: "status",
  label: "Status",
  placeholder: "Status",
  options: ["Approved", "Draft"],
};

const transferFilter = {
  key: "status",
  label: "Status",
  placeholder: "Status",
  options: ["Transferred", "Not Transferred", "Partially Transferred"],
};

export const MANUFACTURING_LIST = {
  "/en/manufacturing/production-plans": {
    title: "Production Plans",
    module: "Manufacturing",
    addLabel: "Add new production",
    addHref: "/en/manufacturing/production-plan-create",
    hideFilterToggle: true,
    showExport: false,
    filters: [itemFilter, statusFilter],
    columns: [
      { key: "production_plan", label: "PRODUCTION PLAN", type: "link" },
      { key: "reference", label: "REFERENCE" },
      { key: "bin_card_id", label: "BIN CARD ID" },
      { key: "quantity", label: "QUANTITY" },
      { key: "cost_of_unit_price", label: "COST OF UNIT PRICE" },
      { key: "start_date", label: "START DATE" },
      { key: "end_date", label: "END DATE" },
      { key: "responsible", label: "RESPONSIBLE" },
      statusCol,
      actionCol,
    ],
    totalEntries: 128,
    rows: padRows(
      PLAN_SAMPLES,
      (r, i) => ({
        id: i + 1,
        production_plan: r[0],
        reference: r[1],
        bin_card_id: r[2],
        quantity: r[3],
        cost_of_unit_price: r[4],
        start_date: r[5],
        end_date: r[6],
        responsible: r[7],
        status: r[8],
      }),
      128,
      (i) => ({
        id: i + 1,
        production_plan: MFG_ITEMS[i % MFG_ITEMS.length],
        reference: `PRP-2026-${String(32 - (i % 32)).padStart(6, "0")}`,
        bin_card_id: `BIN 15200-2026-${String(32 - (i % 32)).padStart(6, "0")}`,
        quantity: String(1 + (i % 40)),
        cost_of_unit_price: String(20 + i * 17),
        start_date: `${(i % 28) + 1} Jul 2026`,
        end_date: `${(i % 28) + 1} Aug 2026`,
        responsible: MFG_PEOPLE[i % MFG_PEOPLE.length],
        status: i % 9 === 0 ? "Draft" : "Approved",
      })
    ),
  },
  "/en/manufacturing/production-plan-templates": {
    title: "Templates",
    module: "Manufacturing",
    addLabel: "Add new template",
    addHref: "/en/manufacturing/production-plan-template-create",
    hideFilterToggle: true,
    showExport: false,
    filters: [itemFilter],
    columns: [
      { key: "reference_number", label: "REFERENCE NUMBER", type: "link" },
      { key: "item", label: "ITEM" },
      { key: "quantity", label: "QUANTITY" },
      { key: "customer", label: "CUSTOMER" },
      { key: "start_date", label: "START DATE" },
      { key: "end_date", label: "END DATE" },
      { key: "responsible", label: "RESPONSIBLE" },
      actionCol,
    ],
    totalEntries: 47,
    rows: padRows(
      [
        ["TEMP-2026-000016", "সয়াবিন তেল - ৫ লিটার", "5", "N/A", "9 Sep 2026", "11 Sep 2026", "RED"],
        ["TEMP-2026-000015", "Chicken Biryani", "200", "N/A", "3 Aug 2026", "3 Aug 2026", "Sujit Kumar Biswas"],
        ["TEMP-2026-000014", "Cotton Fabrics", "100", "MIzan", "20 Jul 2026", "31 Jul 2026", "Nazmul Hossain"],
        ["TEMP-2026-000013", "Cotton Fabrics", "90", "N/A", "8 Jul 2026", "21 Jul 2026", "Bijon Shikder"],
        ["TEMP-2026-000012", "Raaz Soyabin Oil - 1 Litter", "50", "N/A", "13 Jul 2026", "13 Jul 2026", "Tanvir"],
        ["TEMP-2026-000011", "Pusti Happy Noodles", "10", "N/A", "13 Jul 2026", "19 Jul 2026", "Anamul Haque Shahin"],
        ["TEMP-2026-000010", "Pusti Happy Noodles", "10", "N/A", "13 Jul 2026", "19 Jul 2026", "Anamul Haque Shahin"],
        ["TEMP-2026-000009", "Test for price", "5000", "Sakib", "6 Jul 2026", "31 Jul 2026", "Md. Akram Hossain Niloy"],
      ],
      (r, i) => ({
        id: i + 1,
        reference_number: r[0],
        item: r[1],
        quantity: r[2],
        customer: r[3],
        start_date: r[4],
        end_date: r[5],
        responsible: r[6],
      }),
      47,
      (i) => ({
        id: i + 1,
        reference_number: `TEMP-2026-${String(8 - (i % 8)).padStart(6, "0")}`,
        item: MFG_ITEMS[i % MFG_ITEMS.length],
        quantity: String(1 + i * 3),
        customer: i % 3 === 0 ? MFG_CUSTOMERS[i % MFG_CUSTOMERS.length] : "N/A",
        start_date: `${(i % 28) + 1} May 2026`,
        end_date: `${(i % 28) + 1} Jun 2026`,
        responsible: MFG_PEOPLE[i % MFG_PEOPLE.length],
      })
    ),
  },
  "/en/manufacturing/pipelines": {
    title: "Production Pipeline",
    module: "Manufacturing",
    addLabel: "",
    hideFilterToggle: true,
    showExport: false,
    filters: [
      { key: "item", label: "Select Item", placeholder: "Select Item", options: MFG_ITEMS },
      {
        key: "customer",
        label: "Select Customer",
        placeholder: "Select Customer",
        options: MFG_CUSTOMERS,
      },
    ],
    columns: [
      { key: "reference", label: "REFERENCE", type: "link" },
      { key: "production_plan", label: "PRODUCTION PLAN" },
      { key: "customer", label: "CUSTOMER" },
      { key: "quantity", label: "QUANTITY" },
      { key: "deadline", label: "DEADLINE" },
      { key: "responsible_person", label: "RESPONSIBLE PERSON" },
      { key: "production_cost", label: "PRODUCTION COST" },
      { key: "completed_quantity", label: "COMPLETED QUANTITY", type: "progress" },
      actionCol,
    ],
    totalEntries: 118,
    rows: padRows(
      [
        ["PIPE-2026-000040", "Jersey | Manufactured Item", "N/A", "10pc", "30 Sep 2026", "Ibrahim", "৳ 1000", 100],
        ["PIPE-2026-000039", "Jersey | Manufactured Item", "N/A", "1pc", "30 Sep 2026", "Showmik Hossain", "৳ 1500", 100],
        ["PIPE-2026-000038", "Jersey | Manufactured Item", "N/A", "1pc", "30 Sep 2026", "Showmik Hossain", "৳ 1500", 100],
        ["PIPE-2026-000037", "Jersey | Manufactured Item", "N/A", "1pc", "30 Sep 2026", "Showmik Hossain", "৳ 1500", 100],
        ["PIPE-2026-000036", "Charizma Summer Lawn - Red | 42", "N/A", "11pc", "9 Sep 2026", "Nazmul Hossain", "৳ 15600", 100],
        ["PIPE-2026-000035", "2 Core Fiber_Fiber Solution", "N/A", "11m", "9 Sep 2026", "Anamul Haque Shahin", "৳ 6000", 100],
        ["PIPE-2026-000034", "2 Port TJ (Cap)", "N/A", "12pc", "9 Sep 2026", "Anamul Haque Shahin", "৳ 4400", 100],
        ["PIPE-2026-000033", "সয়াবিন তেল - ৫ লিটার", "N/A", "5pc", "11 Sep 2026", "RED", "৳ 4940.05", 40],
        ["PIPE-2026-000032", "Radical - 1000 ml", "N/A", "50pc", "10 Sep 2026", "Nazmul Hossain", "৳ 2600", 96],
        ["PIPE-2026-000031", "Chicken Biryani", "MIzan", "150pc", "20 Aug 2026", "Jahedul Islam", "৳ 2411.42", 92],
        ["PIPE-2026-000030", "Bread", "N/A", "100pc", "11 Aug 2026", "Nazmul Hossain", "৳ 1.42", 98],
      ],
      (r, i) => ({
        id: i + 1,
        reference: r[0],
        production_plan: r[1],
        customer: r[2],
        quantity: r[3],
        deadline: r[4],
        responsible_person: r[5],
        production_cost: r[6],
        completed_quantity: r[7],
        bin_card_id: `BIN 15200-2026-${String(44 - i).padStart(6, "0")}`,
      }),
      118,
      (i) => ({
        id: i + 1,
        reference: `PIPE-2026-${String(20 - (i % 20)).padStart(6, "0")}`,
        production_plan: MFG_ITEMS[i % MFG_ITEMS.length],
        customer: i % 4 === 0 ? MFG_CUSTOMERS[i % MFG_CUSTOMERS.length] : "N/A",
        quantity: `${1 + (i % 50)}pc`,
        deadline: `${(i % 28) + 1} Jul 2026`,
        responsible_person: MFG_PEOPLE[i % MFG_PEOPLE.length],
        production_cost: `৳ ${(200 + i * 90).toLocaleString()}`,
        completed_quantity: [100, 90, 40, 0, 80][i % 5],
        bin_card_id: `BIN 15200-2026-${String(20 - (i % 20)).padStart(6, "0")}`,
      })
    ),
  },
  "/en/manufacturing/finished-goods": {
    title: "Finished Goods",
    module: "Manufacturing",
    addLabel: "",
    hideFilterToggle: true,
    showExport: false,
    filters: [itemFilter, transferFilter],
    columns: [
      { key: "reference", label: "REFERENCE", type: "link" },
      { key: "production_plan", label: "PRODUCTION PLAN" },
      { key: "quantity", label: "QUANTITY" },
      { key: "transferred_quantity", label: "TRANSFERRED QUANTITY" },
      { key: "cost_of_unit_price", label: "COST OF UNIT PRICE" },
      { key: "start_date", label: "START DATE" },
      { key: "end_date", label: "END DATE" },
      { key: "labour_time", label: "LABOUR TIME" },
      { key: "responsible", label: "RESPONSIBLE" },
      { key: "transfer_status", label: "TRANSFER STATUS", type: "status" },
      actionCol,
    ],
    totalEntries: 144,
    rows: padRows(
      [
        ["FIN-2026-000056", "Jersey | Manufactured Item", "10", "3", "৳ 100", "14 Sep 2026", "13 Sep 2026", "0h 0min", "Ibrahim", "Partially Transferred"],
        ["FIN-2026-000055", "Jersey | Manufactured Item", "1", "1", "৳ 1,500", "14 Sep 2026", "13 Sep 2026", "0h 0min", "Showmik Hossain", "Transferred"],
        ["FIN-2026-000054", "Jersey | Manufactured Item", "1", "1", "৳ 1,500", "14 Sep 2026", "13 Sep 2026", "0h 0min", "Showmik Hossain", "Transferred"],
        ["FIN-2026-000053", "Jersey | Manufactured Item", "1", "1", "৳ 1,500", "14 Sep 2026", "13 Sep 2026", "0h 0min", "Showmik Hossain", "Transferred"],
        ["FIN-2026-000052", "Charizma Summer Lawn - Red | 42", "11", "11", "৳ 1,418.18", "14 Sep 2026", "9 Sep 2026", "0h 0min", "Nazmul Hossain", "Transferred"],
        ["FIN-2026-000051", "2 Core Fiber_Fiber Solution", "11", "11", "৳ 545.45", "14 Sep 2026", "9 Sep 2026", "0h 0min", "Anamul Haque Shahin", "Transferred"],
        ["FIN-2026-000050", "2 Port TJ (Cap)", "12", "12", "৳ 366.67", "14 Sep 2026", "9 Sep 2026", "0h 0min", "Anamul Haque Shahin", "Transferred"],
        ["FIN-2026-000049", "সয়াবিন তেল - ৫ লিটার", "2", "2", "৳ 988.01", "14 Sep 2026", "9 Sep 2026", "0h 0min", "RED", "Transferred"],
      ],
      (r, i) => ({
        id: i + 1,
        reference: r[0],
        production_plan: r[1],
        quantity: r[2],
        transferred_quantity: r[3],
        cost_of_unit_price: r[4],
        start_date: r[5],
        end_date: r[6],
        labour_time: r[7],
        responsible: r[8],
        transfer_status: r[9],
        status: r[9],
      }),
      144,
      (i) => {
        const st = ["Transferred", "Not Transferred", "Partially Transferred"][i % 3];
        return {
          id: i + 1,
          reference: `FIN-2026-${String(40 - (i % 40)).padStart(6, "0")}`,
          production_plan: MFG_ITEMS[i % MFG_ITEMS.length],
          quantity: String(1 + (i % 20)),
          transferred_quantity: st === "Transferred" ? String(1 + (i % 20)) : st === "Not Transferred" ? "0" : "1",
          cost_of_unit_price: `৳ ${(50 + i * 12).toLocaleString()}`,
          start_date: "14 Sep 2026",
          end_date: `${(i % 28) + 1} Aug 2026`,
          labour_time: "0h 0min",
          responsible: MFG_PEOPLE[i % MFG_PEOPLE.length],
          transfer_status: st,
          status: st,
        };
      }
    ),
  },
  "/en/manufacturing/waste-goods": {
    title: "Waste Goods",
    module: "Manufacturing",
    addLabel: "",
    hideFilterToggle: true,
    showExport: false,
    filters: [itemFilter, transferFilter],
    columns: [
      { key: "reference", label: "REFERENCE", type: "link" },
      { key: "production_plan", label: "PRODUCTION PLAN" },
      { key: "quantity", label: "QUANTITY" },
      { key: "transferred_quantity", label: "TRANSFERRED QUANTITY" },
      { key: "cost_of_unit_price", label: "COST OF UNIT PRICE" },
      { key: "start_date", label: "START DATE" },
      { key: "end_date", label: "END DATE" },
      { key: "labour_time", label: "LABOUR TIME" },
      { key: "responsible", label: "RESPONSIBLE" },
      { key: "transfer_status", label: "TRANSFER STATUS", type: "status" },
      actionCol,
    ],
    totalEntries: 82,
    rows: padRows(
      [
        ["WAS-2026-000034", "সয়াবিন তেল - ৫ লিটার", "1", "1", "৳ 988.01", "14 Sep 2026", "9 Sep 2026", "0h 0min", "RED", "Transferred"],
        ["WAS-2026-000033", "Radical - 1000 ml", "2", "0", "৳ 52", "14 Sep 2026", "1 Sep 2026", "0h 0min", "Nazmul Hossain", "Not Transferred"],
        ["WAS-2026-000032", "Chicken Biryani", "2", "0", "৳ 16.08", "14 Sep 2026", "12 Aug 2026", "0h 0min", "Jahedul Islam", "Not Transferred"],
        ["WAS-2026-000031", "Chicken Biryani", "10", "0", "৳ 16.08", "14 Sep 2026", "12 Aug 2026", "0h 0min", "Jahedul Islam", "Not Transferred"],
        ["WAS-2026-000030", "Bread", "2", "1", "৳ 0.01", "14 Sep 2026", "9 Aug 2026", "0h 0min", "Nazmul Hossain", "Partially Transferred"],
        ["WAS-2026-000029", "Iron stick", "1", "1", "৳ 700", "14 Sep 2026", "27 Jul 2026", "0h 0min", "Sujit Kumar Biswas", "Transferred"],
        ["WAS-2026-000028", "Chocobar (চকবার)- 35 ml", "1", "0", "৳ 130.97", "14 Sep 2026", "26 Jul 2026", "0h 0min", "Tanvir", "Not Transferred"],
        ["WAS-2026-000027", "Chocobar (চকবার)- 35 ml", "9", "0", "৳ 130.97", "14 Sep 2026", "26 Jul 2026", "0h 0min", "Tanvir", "Not Transferred"],
      ],
      (r, i) => ({
        id: i + 1,
        reference: r[0],
        production_plan: r[1],
        quantity: r[2],
        transferred_quantity: r[3],
        cost_of_unit_price: r[4],
        start_date: r[5],
        end_date: r[6],
        labour_time: r[7],
        responsible: r[8],
        transfer_status: r[9],
        status: r[9],
      }),
      82,
      (i) => {
        const st = ["Not Transferred", "Transferred", "Partially Transferred"][i % 3];
        return {
          id: i + 1,
          reference: `WAS-2026-${String(20 - (i % 20)).padStart(6, "0")}`,
          production_plan: MFG_ITEMS[i % MFG_ITEMS.length],
          quantity: String(1 + (i % 9)),
          transferred_quantity: st === "Transferred" ? String(1 + (i % 9)) : st === "Not Transferred" ? "0" : "1",
          cost_of_unit_price: `৳ ${(10 + i * 8).toLocaleString()}`,
          start_date: "14 Sep 2026",
          end_date: `${(i % 28) + 1} Jul 2026`,
          labour_time: i % 7 === 0 ? "0h 1min" : "0h 0min",
          responsible: MFG_PEOPLE[i % MFG_PEOPLE.length],
          transfer_status: st,
          status: st,
        };
      }
    ),
  },
  "/en/manufacturing/manufacturing-settings": {
    type: "special",
    special: "mfg-settings",
    title: "Settings",
    module: "Manufacturing",
  },
};

export const MANUFACTURING_FORMS = {
  "/en/manufacturing/production-plan-create": {
    type: "special",
    special: "mfg-plan-form",
    title: "New Production Plan",
    module: "Manufacturing",
    backHref: "/en/manufacturing/production-plans",
    formMode: "create",
  },
  "/en/manufacturing/production-plan-update": {
    type: "special",
    special: "mfg-plan-form",
    title: "Edit Production Plan",
    module: "Manufacturing",
    backHref: "/en/manufacturing/production-plans",
    formMode: "edit",
  },
  "/en/manufacturing/production-plan-details": {
    type: "special",
    special: "mfg-plan-form",
    title: "Production Plan Details",
    module: "Manufacturing",
    backHref: "/en/manufacturing/production-plans",
    formMode: "details",
  },
  "/en/manufacturing/production-plan-template-create": {
    type: "special",
    special: "mfg-plan-form",
    title: "New Production Plan Template",
    module: "Manufacturing",
    backHref: "/en/manufacturing/production-plan-templates",
    formMode: "create",
    isTemplate: true,
  },
  "/en/manufacturing/production-plan-template-details": {
    type: "special",
    special: "mfg-plan-form",
    title: "Template Details",
    module: "Manufacturing",
    backHref: "/en/manufacturing/production-plan-templates",
    formMode: "details",
    isTemplate: true,
  },
  "/en/manufacturing/item-pipeline": {
    type: "special",
    special: "mfg-pipeline",
    title: "Item Pipeline",
    module: "Manufacturing",
    backHref: "/en/manufacturing/pipelines",
  },
  "/en/manufacturing/finished-goods-details": {
    type: "special",
    special: "mfg-plan-form",
    title: "Finished Goods Details",
    module: "Manufacturing",
    backHref: "/en/manufacturing/finished-goods",
    formMode: "details",
  },
  "/en/manufacturing/waste-goods-details": {
    type: "special",
    special: "mfg-plan-form",
    title: "Waste Goods Details",
    module: "Manufacturing",
    backHref: "/en/manufacturing/waste-goods",
    formMode: "details",
  },
};

export const PLAN_SEED = {
  1: {
    item: "Jersey | Manufactured Item",
    customer: "",
    binCard: "BIN 15200-2026-000044",
    workOrder: "",
    quantity: "10",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    team: "Key Manager 1",
    responsible: "Ibrahim",
    members: ["Ibrahim"],
    template: "",
    saveAsTemplate: false,
    lines: [{ id: 1, item: "Cotton Yarn", stock: "240", planned: "12", price: "80", inventory: "Main Store" }],
    notes: "",
  },
};

export const PIPELINE_SEED = {
  1: {
    item: "Jersey | Manufactured Item",
    quantity: "10pc",
    binCardId: "BIN 15200-2026-000044",
    date: "13 Sep 2026",
    lastStage: "Open",
    stage: "Completed",
  },
};

export const SETTINGS_MEMBERS = [
  { initials: "AH", name: "Anamul Haque Shahin", email: "anamul.companymail@g…", color: "#0ea5e9" },
  { initials: "NH", name: "Nazmul Hossain", email: "nazmul.companynam@gm…", color: "#10b981" },
  { initials: "JI", name: "Jahedul Islam", email: "jahed.companymail@gm…", color: "#f43f5e" },
  { initials: "MA", name: "Md. Akram Hossain Niloy", email: "akram.companymail@gm…", color: "#8b5cf6" },
  { initials: "N", name: "Nayem Uddin", email: "", color: "#64748b" },
  { initials: "SK", name: "Sujit Kumar Biswas", email: "sujit.companyname@gm…", color: "#f59e0b" },
  { initials: "B", name: "Bijon Shikder", email: "bijon.companyname@gm…", color: "#06b6d4" },
  { initials: "NS", name: "Nitai Sen Gupta Das", email: "nitai.nayan@gmai.com", color: "#84cc16" },
  { initials: "R", name: "Rohan", email: "", color: "#ef4444" },
  { initials: "T", name: "Tanvir", email: "", color: "#2563eb" },
];

export const SETTINGS_TEAMS = [
  { name: "Key Manager 1", members: ["AH", "NH", "JI", "MA"], extra: 6 },
  { name: "green", members: ["JI", "AH", "NH"], extra: 0 },
  { name: "Mango Juice team", members: ["MA", "S", "MA", "NS"], extra: 3 },
  { name: "xyza", members: ["R"], extra: 0 },
  { name: "Samir", members: ["S", "MA", "NS"], extra: 0 },
  { name: "Style Mart", members: ["R", "S", "MA"], extra: 0 },
  { name: "Distribution team", members: ["T"], extra: 0 },
  { name: "Manufacture team", members: ["SK"], extra: 0 },
  { name: "Ice Team", members: ["MX", "PB", "আ"], extra: 0 },
  { name: "Helium", members: ["SH", "MI", "I"], extra: 0 },
];
