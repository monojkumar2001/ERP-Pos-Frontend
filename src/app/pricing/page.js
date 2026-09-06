import Link from "next/link";
import PricingSection from "../../components/PricingSection";
import CustomERP from "../../components/CustomERP";
import FAQ from "../../components/FAQ";
import CTABanner from "../../components/CTABanner";
import { pricingFaqs } from "../../data/site";

export const metadata = {
  title: "Biznify ERP Pricing - Affordable ERP Solution in Bangladesh",
  description:
    "Simple, transparent Biznify ERP pricing plans for startups, SMEs, and enterprises in Bangladesh.",
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site text-center">
          <h1 className="section-title">Simple, Transparent Pricing</h1>
          <p className="section-sub">
            Choose the plan that&apos;s right for your business. All plans include a 14-day
            free trial with no credit card required.
          </p>
          <Link href="#plans" className="btn-solid mt-8 inline-flex">
            View Plans
          </Link>
        </div>
      </section>

      <div id="plans">
        <PricingSection showHeading={false} />
      </div>

      <CustomERP />

      <section className="py-16 md:py-20">
        <div className="container-site">
          <div className="overflow-hidden rounded-4xl bg-brand-gradient p-8 text-white md:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-semibold">Enterprise ERP Plan</h2>
                <p className="mt-2 text-white/80">All-inclusive. Unlimited Power. Fully Yours.</p>
                <ul className="mt-6 space-y-2 text-sm">
                  <li>✓ All modules unlocked</li>
                  <li>✓ Custom workflows & integrations</li>
                  <li>✓ Dedicated onboarding & support</li>
                  <li>✓ Multi-branch enterprise controls</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <h3 className="text-xl font-semibold">Custom ERP That Works Like You</h3>
                <p className="mt-3 text-sm text-white/80">
                  Transform your business operations with a fully customized enterprise
                  solution designed around your unique processes and goals.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/schedule-your-demo"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-secondary"
                  >
                    Schedule a Meeting
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium"
                  >
                    Expert Call
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ
        items={pricingFaqs}
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our pricing, billing, and plans."
      />
      <CTABanner />
    </>
  );
}
