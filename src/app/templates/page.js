import Link from "next/link";
import CTABanner from "../../components/CTABanner";

export const metadata = {
  title: "Templates | Biznify ERP",
  description: "Ready industry templates to launch your Biznify-connected online store faster.",
};

const templates = [
  "Fashion & Apparel",
  "Grocery & Convenience",
  "Electronics Store",
  "Pharmacy & Wellness",
  "Furniture & Home",
  "Wholesale Distribution",
  "Restaurant & Cafe",
  "Beauty & Cosmetics",
];

export default function TemplatesPage() {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site text-center">
          <h1 className="section-title">25+ Ready Templates</h1>
          <p className="section-sub">
            Launch your online store quickly with industry-specific templates that sync
            with Biznify ERP through GetCommerce.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((name) => (
            <div key={name} className="card-feature text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-2xl text-primary">
                ◆
              </div>
              <h3 className="text-lg font-semibold text-title">{name}</h3>
              <Link href="/demo-request" className="link-more mt-4 justify-center">
                Request Template →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
