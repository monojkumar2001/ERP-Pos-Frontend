import ContactForm from "../../components/ContactForm";
import CTABanner from "../../components/CTABanner";

export const metadata = {
  title: "Schedule Your Demo | Biznify ERP",
  description: "Schedule a live Biznify ERP demo with our specialist team.",
};

export default function ScheduleDemoPage() {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site max-w-3xl text-center">
          <h1 className="section-title">Schedule Your Demo</h1>
          <p className="section-sub">
            Book a meeting with our ERP specialists and see how Biznify fits your
            workflows, modules, and growth plans.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site max-w-xl">
          <div className="rounded-4xl border border-line bg-white p-8 shadow-card">
            <h2 className="mb-6 text-xl font-semibold text-title">Quote Request</h2>
            <ContactForm
              fields={[
                "fullName",
                "business",
                "email",
                "phone",
                "country",
                "address",
                "message",
              ]}
              submitLabel="Submit"
            />
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
