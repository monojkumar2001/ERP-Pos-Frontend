import ContactForm from "../../components/ContactForm";
import CTABanner from "../../components/CTABanner";

export const metadata = {
  title: "Demo Request | Biznify ERP",
  description: "Request a Biznify ERP demo or start your 30-day free trial.",
};

export default function DemoRequestPage() {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site max-w-3xl text-center">
          <h1 className="section-title">Request a Demo / Start Trial</h1>
          <p className="section-sub">
            Tell us about your business and we&apos;ll help you get started with Biznify
            ERP. Enjoy a 30-day free trial with guided onboarding.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site max-w-xl">
          <div className="rounded-4xl border border-line bg-white p-8 shadow-card">
            <h2 className="mb-6 text-xl font-semibold text-title">Package Order Request</h2>
            <ContactForm
              fields={["package", "users", "fullName", "phone", "email", "address"]}
              submitLabel="Submit"
            />
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
