import CTABanner from "../../components/CTABanner";

export const metadata = {
  title: "Changelog | Biznify ERP",
  description: "Latest Biznify ERP product updates, improvements, and fixes.",
};

const logs = [
  {
    version: "v2.8.0",
    date: "May 2026",
    items: [
      "Improved dashboard performance for multi-branch businesses",
      "Enhanced POS checkout shortcuts and receipt options",
      "New inventory low-stock alert filters",
    ],
  },
  {
    version: "v2.7.2",
    date: "Feb 2026",
    items: [
      "Accounting recurring journals improvements",
      "Faster sales invoice PDF generation",
      "Bug fixes in purchase return workflow",
    ],
  },
  {
    version: "v2.7.0",
    date: "Oct 2025",
    items: [
      "Expanded e-commerce sync options with GetCommerce",
      "Mobile app report widgets update",
      "HR leave balance refinements",
    ],
  },
  {
    version: "v2.6.0",
    date: "Jul 2025",
    items: [
      "New manufacturing production order tracking",
      "SSLCommerz and wallet payment addon updates",
      "UI polish across pricing and onboarding flows",
    ],
  },
];

export default function ChangeLogPage() {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site text-center">
          <h1 className="section-title">Changelog</h1>
          <p className="section-sub">
            Track the latest Biznify product updates, enhancements, and fixes.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site max-w-3xl space-y-6">
          {logs.map((log) => (
            <div
              key={log.version}
              className="rounded-3xl border border-line bg-white p-6 shadow-soft"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-primary">{log.version}</h2>
                <span className="text-sm text-muted">{log.date}</span>
              </div>
              <ul className="space-y-2">
                {log.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
