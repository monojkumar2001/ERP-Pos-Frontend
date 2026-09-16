/**
 * Configuration pages from header Settings drawer.
 * Aligned with docs/biznify-settings-scrape/biznify-settings-documentation.json
 */
function cols(...labels) {
  return labels.map((label) => {
    if (label === "ACTION") return { key: "action", label, type: "action" };
    if (label === "STATUS") return { key: "status", label, type: "status" };
    const key = String(label)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
    const linkish = /^(NAME|ADJUSTMENT_REASON)$/i.test(key) || /^(NAME)$/i.test(label);
    return linkish ? { key, label, type: "link" } : { key, label };
  });
}

function rows(columns, data) {
  return data.map((arr, i) => {
    const row = { id: i + 1 };
    columns.forEach((c, idx) => {
      if (c.key === "action") return;
      row[c.key] = arr[idx] ?? "";
    });
    return row;
  });
}

const SIGNATURE_FIELDS = [
  {
    key: "receiver_signature",
    label: "Receiver Signature Field",
    hint: "Show a signature field for the receiver on the printed document",
    type: "checkbox",
    default: true,
  },
  {
    key: "accountant_signature",
    label: "Accountant Signature",
    hint: "Include an accountant signature section on the document",
    type: "checkbox",
  },
  {
    key: "manager_signature",
    label: "Manager Signature",
    hint: "Include a manager signature section on the document",
    type: "checkbox",
  },
  {
    key: "authorized_signature",
    label: "Authorized Signature",
    hint: "Include an authorized person's signature section on the document",
    type: "checkbox",
  },
];

const SALE_SECTIONS = [
  {
    title: "SIGNATURES",
    fields: [
      {
        key: "authorized_signature",
        label: "Authorized Signature",
        hint: "Add an authorized signature section to the document",
        type: "checkbox",
        default: true,
      },
      {
        key: "display_signature_image",
        label: "Display Signature Image",
        hint: "Show the uploaded image; if disabled, only a blank field appears",
        type: "checkbox",
        default: true,
      },
      {
        key: "customer_signature",
        label: "Customer Signature Field",
        hint: "Show a signature field for the customer on the printed document",
        type: "checkbox",
      },
    ],
  },
  {
    title: "BEHAVIOUR & DISPLAY",
    fields: [
      {
        key: "item_discount",
        label: "Item Discount",
        hint: "Allow applying item-level discounts on each line item",
        type: "checkbox",
      },
      {
        key: "show_item_info",
        label: "Show Item Information",
        hint: "Display manufacturer, brand, colour and size details in the document",
        type: "checkbox",
      },
      {
        key: "show_short_desc",
        label: "Show Item Short Description",
        hint: "Include the item's short description text on the document",
        type: "checkbox",
        default: true,
      },
      {
        key: "allow_zero_stock",
        label: "Allow Zero Stock Items",
        hint: "Allow adding items with zero available stock to quotations",
        type: "checkbox",
        default: true,
      },
    ],
  },
  {
    title: "DOCUMENT",
    fields: [
      {
        key: "notes_terms",
        label: "Notes / Terms",
        hint: "Add a custom notes or terms section at the bottom of the document",
        type: "textarea",
        default: "Warranty: 1 Year / Servicing: 2 Year",
      },
      {
        key: "footer",
        label: "Footer",
        hint: "Add a custom footer section at the bottom of the document",
        type: "textarea",
        default: "Thank You",
      },
    ],
  },
];

function cb(label, key, def = false) {
  return {
    key: key || label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    label,
    type: "checkbox",
    default: def,
  };
}

function ta(label, key, def = "") {
  return {
    key: key || label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    label,
    type: "textarea",
    default: def,
  };
}

const SALE_TAB_FIELDS = {
  QUOTATION: SALE_SECTIONS.flatMap((s) => s.fields),
  ORDER: [
    cb("Create Without Quotation", "create_without_quotation", true),
    cb("Edit Selling Price", "edit_selling_price"),
    cb("Edit VAT", "edit_vat"),
    cb("Allow Return After Billing", "allow_return_after_billing"),
    cb("Allow Return After Payment", "allow_return_after_payment"),
    cb("Item Discount", "item_discount"),
    cb("Allow Discount Modification", "allow_discount_mod"),
    cb("Edit Discount on Direct Invoice", "edit_discount_direct"),
    cb("Show Discount on Invoice", "show_discount_invoice"),
    cb("Authorized Signature", "authorized_signature", true),
    cb("Customer Signature Field", "customer_signature"),
    cb("Show Item Information", "show_item_info"),
    cb("Show Item Short Description", "show_short_desc", true),
    ta("Notes / Terms", "notes_terms"),
    ta("Footer", "footer"),
  ],
  DELIVERY: [
    cb("Authorized Signature", "authorized_signature", true),
    cb("Display Signature Image", "display_signature_image", true),
    cb("Customer Signature Field", "customer_signature"),
    cb("Send SMS", "send_sms"),
    cb("Send Email", "send_email"),
    cb("Show Item Information", "show_item_info"),
    cb("Show Item Short Description", "show_short_desc", true),
    cb("Shipping Contact Information", "shipping_contact"),
    cb("Delivery Charge for E-commerce Only", "delivery_charge_ecom"),
    ta("Notes / Terms", "notes_terms"),
    ta("Footer", "footer"),
  ],
  INVOICE: [
    cb("Outstanding Balance", "outstanding_balance"),
    cb("Previous Due", "previous_due"),
    cb("Show on PDF", "show_on_pdf", true),
    cb("Allow Invoice After Credit Limit", "allow_after_credit_limit"),
    cb("Due Date", "due_date", true),
    cb("Authorized Signature", "authorized_signature", true),
    cb("Display Signature Image", "display_signature_image", true),
    cb("Customer Signature Field", "customer_signature"),
    cb("Send SMS", "send_sms"),
    cb("Send Email", "send_email"),
    cb("Show Item Information", "show_item_info"),
    cb("Show Item Short Description", "show_short_desc", true),
    cb("Show Item Batch Information", "show_batch_info"),
    cb("Allow Change Sales Person", "allow_change_sales_person"),
    cb("Billing Contact Information", "billing_contact"),
    { key: "bin_number", label: "Bin Number", type: "text" },
    { key: "tax_reg_number", label: "Tax Registration Number", type: "text" },
    ta("Notes / Terms", "notes_terms"),
    ta("Footer", "footer"),
  ],
  PAYMENT: [
    cb("Send SMS", "send_sms"),
    cb("Send Email", "send_email"),
    cb(
      "Show Batch Payment as a Single Payment On Customer Ledger",
      "batch_as_single"
    ),
  ],
  RETURN: [
    cb("Show Item Information", "show_item_info"),
    cb("Show Item Short Description", "show_short_desc", true),
  ],
};

const PURCHASE_TAB_FIELDS = {
  REQUISITION: [
    cb("Edit Purchasing Price", "edit_purchasing_price", true),
    cb("Signature 1", "signature_1", true),
    cb("Signature 2", "signature_2", true),
    cb("Signature 3", "signature_3"),
    cb("Signature 4", "signature_4"),
    ta("Notes / Terms", "notes_terms"),
  ],
  ORDER: [
    cb("Create Without Requisition", "create_without_requisition", true),
    cb("Edit Purchasing Price", "edit_purchasing_price", true),
    cb("Change Purchasing VAT", "change_purchasing_vat"),
    cb("Item-Wise Discount", "item_wise_discount"),
    cb("Return After Payment", "return_after_payment"),
    cb("Show Item Short Description", "show_short_desc", true),
    cb("Signature 1", "signature_1", true),
    cb("Signature 2", "signature_2", true),
    cb("Signature 3", "signature_3"),
    cb("Signature 4", "signature_4"),
    ta("Notes / Terms", "notes_terms", "Order Note"),
  ],
  RECEIPT: [
    cb("Signature 1", "signature_1", true),
    cb("Signature 2", "signature_2", true),
    cb("Signature 3", "signature_3"),
    cb("Signature 4", "signature_4"),
    ta("Notes / Terms", "notes_terms", "Receipt Note"),
  ],
  BILL: [
    cb("Signature 1", "signature_1", true),
    cb("Signature 2", "signature_2", true),
    cb("Signature 3", "signature_3"),
    cb("Signature 4", "signature_4"),
    ta("Notes / Terms", "notes_terms"),
  ],
  PAYMENT: [
    cb("Signature 1", "signature_1", true),
    cb("Signature 2", "signature_2", true),
    cb("Signature 3", "signature_3"),
    cb("Signature 4", "signature_4"),
    ta("Notes / Terms", "notes_terms"),
  ],
};

const HRM_TAB_FIELDS = {
  EMPLOYEE: [cb("Custom Employee Code", "custom_employee_code", true)],
  PAYSLIP: [
    cb("Overtime Fee", "overtime_fee"),
    cb("After Full Working Hours Only", "after_full_hours"),
    cb("Early Out Fee", "early_out_fee"),
    cb("Late Fee", "late_fee"),
  ],
  ATTENDANCE: [
    {
      key: "attendance_mode",
      label: "Attendance Mode",
      type: "select",
      options: ["Manual", "Through Device (ZKTeco)"],
      default: "Manual",
    },
    { key: "database_name", label: "Database Name", type: "text" },
    { key: "username", label: "Username", type: "text" },
    { key: "password", label: "Password", type: "text" },
    { key: "early_out_threshold", label: "Early Out Threshold (min)", type: "text", default: "15" },
    { key: "overtime_threshold", label: "Overtime Threshold (min)", type: "text", default: "30" },
  ],
};

const vatCols = cols("NAME", "RATE (%)", "ACTION");
const discountCols = cols(
  "NAME",
  "APPLIED TO",
  "RATE",
  "EFFECTIVE FROM",
  "EFFECTIVE TO",
  "ACTION"
);
const paymentCols = cols(
  "NAME",
  "PAYMENT TYPE",
  "ACCOUNT",
  "EXPENSE ACCOUNT",
  "CHARGE",
  "STATUS",
  "ACTION"
);
const warehouseCols = cols("NAME", "ACTION");
const reasonCols = cols(
  "ADJUSTMENT REASON",
  "TYPE",
  "DESCRIPTION",
  "ACCOUNT",
  "STATUS",
  "ACTION"
);
const customFieldCols = cols(
  "NAME",
  "DESCRIPTION",
  "APPLIED ON",
  "DATA TYPE",
  "STATUS",
  "ACTION"
);
const chargeCols = cols(
  "COUNTRY",
  "DIVISION",
  "DISTRICT",
  "THANA",
  "UP TO 0.5 KG",
  "(0.5 - 1) KG",
  "(1 - 2) KG",
  "(2 - 3) KG",
  "PER KG ABOVE 3 KG",
  "ACTION"
);

export const SETTINGS_PAGE_CONFIGS = {
  "/en/tax/tax-list": {
    type: "list",
    title: "VAT",
    module: "Configuration",
    addLabel: "Add VAT",
    addHref: "/en/tax/tax-create",
    hideFilterToggle: true,
    apiEndpoint: "/settings/taxes",
    columns: vatCols,
    rows: [],
    totalEntries: 0,
  },
  "/en/tax/tax-create": {
    type: "form",
    title: "Create New VAT",
    module: "Configuration",
    backHref: "/en/tax/tax-list",
    apiEndpoint: "/settings/taxes",
    fields: [
      { key: "name", label: "VAT Name", required: true, placeholder: "VAT Name" },
      { key: "rate", label: "Rate (%)", required: true, placeholder: "VAT Amount" },
      {
        key: "account",
        label: "Account",
        type: "select",
        required: true,
        options: ["VAT Payable", "VAT Receivable", "Output VAT", "Input VAT"],
        placeholder: "Select Account",
      },
      { key: "collected_on_sales", label: "VAT collected on sales", type: "checkbox" },
      { key: "paid_on_purchase", label: "VAT paid on purchase", type: "checkbox" },
    ],
  },
  "/en/discount/discount-list": {
    type: "list",
    title: "Discount",
    module: "Configuration",
    addLabel: "Add Discount",
    addHref: "/en/discount/discount-create",
    hideFilterToggle: true,
    apiEndpoint: "/settings/discounts",
    columns: discountCols,
    rows: [],
    totalEntries: 0,
  },
  "/en/discount/discount-create": {
    type: "form",
    title: "Add Discount",
    module: "Configuration",
    backHref: "/en/discount/discount-list",
    apiEndpoint: "/settings/discounts",
    fields: [
      { key: "name", label: "Name", required: true, placeholder: "Discount Name" },
      {
        key: "applied_to",
        label: "Applied To",
        type: "select",
        required: true,
        options: ["Products", "Brands", "Services", "All"],
        placeholder: "Select",
      },
      { key: "rate", label: "Rate", required: true, placeholder: "Rate % or amount" },
      { key: "effective_from", label: "Effective From", type: "date", required: true },
      { key: "effective_to", label: "Effective To", type: "date" },
    ],
  },
  "/en/settings/payment-methods": {
    type: "list",
    title: "Payment Methods",
    module: "Configuration",
    addLabel: "Add New",
    addHref: "/en/settings/payment-method-create",
    hideFilterToggle: true,
    apiEndpoint: "/settings/payment-methods",
    columns: paymentCols,
    rows: [],
    totalEntries: 0,
  },
  "/en/settings/payment-method-create": {
    type: "form",
    title: "Add Payment Method",
    module: "Configuration",
    backHref: "/en/settings/payment-methods",
    apiEndpoint: "/settings/payment-methods",
    fields: [
      { key: "name", label: "Name", required: true, placeholder: "Enter Payment Method Name" },
      {
        key: "account_type",
        label: "Account Type",
        type: "select",
        required: true,
        options: ["Cash", "Bank", "MobileBank", "Card", "Other"],
        placeholder: "Select Account Type",
      },
      {
        key: "account",
        label: "Account",
        type: "select",
        required: true,
        options: ["Cash on Hand", "NRB Bank", "Bkash Merchant", "Pos Cash"],
        placeholder: "Select Account",
      },
      {
        key: "expense_account",
        label: "Expense Account",
        type: "select",
        required: true,
        options: ["N/A", "Bank Service Charges", "Purchase"],
        placeholder: "Select Expense Account",
      },
      { key: "charge", label: "Charge", required: true, placeholder: "Enter Charge" },
    ],
  },
  "/en/inventory/warehouses": {
    type: "list",
    title: "Warehouses",
    module: "Configuration",
    addLabel: "Add New",
    addHref: "/en/inventory/warehouse-create",
    hideFilterToggle: true,
    columns: warehouseCols,
    rows: rows(warehouseCols, [
      ["Food Cart"],
      ["ROSE"],
      ["River"],
      ["Fruit"],
      ["Flower"],
      ["Toiyota"],
      ["Own Factory"],
      ["Farhad Factory"],
      ["Dhanmondi"],
      ["GMPS Store-01"],
      ["Shewrapara Warehouse"],
      ["Mirpur"],
      ["Madanganj Warehouse"],
      ["Default"],
    ]),
    totalEntries: 23,
  },
  "/en/inventory/warehouse-create": {
    type: "form",
    title: "Add Warehouse",
    module: "Configuration",
    backHref: "/en/inventory/warehouses",
    apiEndpoint: "/master/warehouses",
    fields: [{ key: "name", label: "Name", required: true, placeholder: "Warehouse Name" }],
  },
  "/en/inventory/bin-locations": {
    type: "special",
    special: "bin-locations",
    title: "Bin Locations",
    module: "Configuration",
  },
  "/en/inventory/adjustment-reasons": {
    type: "list",
    title: "Adjustment Reasons",
    module: "Configuration",
    addLabel: "Add New",
    addHref: "/en/inventory/adjustment-reason-create",
    hideFilterToggle: true,
    apiEndpoint: "/settings/adjustment-reasons",
    columns: reasonCols,
    rows: [],
    totalEntries: 0,
  },
  "/en/inventory/adjustment-reason-create": {
    type: "form",
    title: "Add Adjustment Reason",
    module: "Configuration",
    backHref: "/en/inventory/adjustment-reasons",
    apiEndpoint: "/settings/adjustment-reasons",
    fields: [
      { key: "name", label: "Adjustment Reason", required: true, placeholder: "Reason" },
      {
        key: "type",
        label: "Type",
        type: "select",
        required: true,
        options: ["Add", "Subtract"],
        placeholder: "Select Type",
      },
      { key: "description", label: "Description", type: "textarea", placeholder: "Description" },
      {
        key: "account",
        label: "Account",
        type: "select",
        options: ["Cost of Goods Sold", "Inventory"],
        placeholder: "Select Account",
      },
    ],
  },
  "/en/settings/delivery-channels": {
    type: "special",
    special: "delivery-channels",
    title: "Delivery Channels",
    module: "Configuration",
  },
  "/en/settings/delivery-charges": {
    type: "list",
    title: "Delivery Charges",
    module: "Configuration",
    addLabel: "Create",
    secondaryAddLabel: "Generate",
    apiEndpoint: "/settings/delivery-charges",
    hideFilterToggle: false,
    filters: [
      { key: "country", label: "Country", placeholder: "Country", options: ["Bangladesh"] },
      {
        key: "division",
        label: "State/Division",
        placeholder: "State/Division",
        options: ["Dhaka", "Chattogram", "Rajshahi"],
      },
      {
        key: "district",
        label: "District",
        placeholder: "District",
        options: ["Dhaka", "Gazipur", "Narayanganj"],
      },
      {
        key: "thana",
        label: "Thana",
        placeholder: "Thana",
        options: ["Badda", "Gulshan", "Uttara"],
      },
    ],
    columns: chargeCols,
    rows: [],
    totalEntries: 0,
  },
  "/en/settings/custom-fields": {
    type: "list",
    title: "Custom Fields",
    module: "Configuration",
    addLabel: "Add New",
    addHref: "/en/settings/custom-field-create",
    hideFilterToggle: true,
    apiEndpoint: "/settings/custom-fields",
    columns: customFieldCols,
    rows: [],
    totalEntries: 0,
  },
  "/en/settings/custom-field-create": {
    type: "form",
    title: "Add Custom Field",
    module: "Configuration",
    backHref: "/en/settings/custom-fields",
    apiEndpoint: "/settings/custom-fields",
    fields: [
      { key: "name", label: "Name", required: true, placeholder: "Field Name" },
      { key: "description", label: "Description", placeholder: "Description" },
      {
        key: "applied_on",
        label: "Applied On",
        type: "select",
        required: true,
        options: ["Item", "Customer", "Supplier", "Employee"],
        placeholder: "Select",
      },
      {
        key: "data_type",
        label: "Data Type",
        type: "select",
        required: true,
        options: ["Text", "Number", "Date", "Checkbox", "TextBox", "Dropdown"],
        placeholder: "Select Type",
      },
    ],
  },
  "/en/settings/template-settings": {
    type: "special",
    special: "template-settings",
    title: "Template Setting",
    module: "Configuration",
  },
  "/en/item-config/uom-conversions": {
    type: "special",
    special: "uom-conversions",
    title: "UoM Conversions",
    module: "Configuration",
  },

  "/en/settings/accounting-settings": {
    type: "special",
    special: "config-settings",
    title: "Accounting Settings",
    module: "Configuration",
    settingsKeyPrefix: "accounting.",
    tabs: ["JOURNAL", "EXPENSE", "INCOME", "TRANSFER MONEY"],
    sections: [{ title: "Signatures", fields: SIGNATURE_FIELDS }],
  },
  "/en/sales/sales-settings": {
    type: "special",
    special: "config-settings",
    title: "Sales Settings",
    module: "Configuration",
    settingsKeyPrefix: "sales.",
    tabs: ["QUOTATION", "ORDER", "DELIVERY", "INVOICE", "PAYMENT", "RETURN"],
    tabFields: SALE_TAB_FIELDS,
    quotationSections: SALE_SECTIONS,
  },
  "/en/settings/purchase-setting": {
    type: "special",
    special: "config-settings",
    title: "Purchase Settings",
    module: "Configuration",
    settingsKeyPrefix: "purchase.",
    tabs: ["REQUISITION", "ORDER", "RECEIPT", "BILL", "PAYMENT"],
    tabFields: PURCHASE_TAB_FIELDS,
  },
  "/en/settings/customer-setting": {
    type: "special",
    special: "config-settings",
    title: "Customer Settings",
    module: "Configuration",
    settingsKeyPrefix: "customer.",
    sections: [
      {
        title: "Customer Preferences",
        fields: [
          {
            key: "require_phone",
            label: "Require Phone Number",
            hint: "Phone number becomes mandatory when creating or editing a customer",
            type: "checkbox",
          },
          {
            key: "require_email",
            label: "Require Email Address",
            hint: "Email address becomes mandatory when creating or editing a customer",
            type: "checkbox",
          },
          {
            key: "custom_customer_code",
            label: "Custom Customer Code",
            hint: "Allow manually entering a custom customer ID instead of auto-generation",
            type: "checkbox",
          },
          {
            key: "credit_limit",
            label: "Credit Limit",
            hint: "Enable setting a maximum credit limit per customer for sales transactions",
            type: "checkbox",
          },
        ],
      },
    ],
  },
  "/en/settings/pos-settings": {
    type: "special",
    special: "config-settings",
    title: "Pos Settings",
    module: "Configuration",
    settingsKeyPrefix: "pos.",
    sections: [
      {
        title: "POS Preferences",
        fields: [
          { key: "allow_refund", label: "Allow refund", type: "checkbox", default: true },
          {
            key: "order_barcode",
            label: "Enable order number barcode printing on receipt",
            type: "checkbox",
            default: true,
          },
          {
            key: "walking_customer",
            label: "Allow walking customer",
            type: "checkbox",
            default: true,
          },
          {
            key: "return_days",
            label: "Allow Return within N days of invoice creation",
            type: "text",
            default: "5",
          },
          {
            key: "printer_size",
            label: "Select POS reciept printer size",
            type: "select",
            options: ["58mm", "80mm"],
            default: "80mm",
          },
        ],
      },
    ],
  },
  "/en/settings/hr-payroll-settings": {
    type: "special",
    special: "config-settings",
    title: "HRM Settings",
    module: "Configuration",
    settingsKeyPrefix: "hrm.",
    tabs: ["EMPLOYEE", "PAYSLIP", "ATTENDANCE"],
    tabFields: HRM_TAB_FIELDS,
  },
  "/en/settings/advanced-settings": {
    type: "special",
    special: "config-settings",
    title: "Advanced Settings",
    module: "Configuration",
    settingsKeyPrefix: "advanced.",
    sections: [
      {
        title: "Number Format",
        fields: [
          {
            key: "decimal_digit_limit",
            label: "Decimal Digit Limit",
            hint: "Up to 6 digits allowed after the decimal point.",
            type: "text",
            default: "2",
          },
        ],
      },
    ],
  },
  "/en/settings/email-setting": {
    type: "special",
    special: "config-settings",
    title: "Email Configuration",
    module: "Configuration",
    settingsKeyPrefix: "email.",
    sections: [
      {
        title: "SMTP Settings",
        fields: [
          {
            key: "driver",
            label: "Mail Driver",
            type: "select",
            options: ["smtp", "sendmail"],
            default: "smtp",
          },
          { key: "host", label: "SMTP Host", type: "text" },
          { key: "port", label: "SMTP Port", type: "text", default: "587" },
          { key: "username", label: "SMTP Username", type: "text" },
          { key: "password", label: "SMTP Password", type: "text" },
          { key: "from_address", label: "From Email", type: "text" },
          { key: "from_name", label: "From Name", type: "text" },
        ],
      },
    ],
  },
  "/en/sms/sms-settings": {
    type: "special",
    special: "config-settings",
    title: "SMS Configuration",
    module: "Configuration",
    settingsKeyPrefix: "sms.",
    sections: [
      {
        title: "SMS Gateway",
        fields: [
          {
            key: "provider",
            label: "Provider",
            type: "select",
            options: ["BulkSMS", "SSL Wireless", "Other"],
            default: "BulkSMS",
          },
          { key: "api_key", label: "API Key", type: "text" },
          { key: "sender_id", label: "Sender ID", type: "text" },
        ],
      },
    ],
  },
  "/en/sms/sms-templates": {
    type: "list",
    title: "SMS Templates",
    module: "Configuration",
    addLabel: "Add Template",
    hideFilterToggle: true,
    apiEndpoint: "/settings/sms-templates",
    columns: [
      { key: "name", label: "NAME", type: "link" },
      { key: "type", label: "TYPE" },
      { key: "status", label: "STATUS", type: "status" },
      { key: "action", label: "ACTION", type: "action" },
    ],
    rows: [],
    totalEntries: 0,
  },
};
