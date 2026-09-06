import Link from "next/link";
import FAQ from "../../components/FAQ";
import CTABanner from "../../components/CTABanner";
import { homeFaqs } from "../../data/site";
import ContactForm from "../../components/ContactForm";

export const metadata = {
  title: "Contact Us | Biznify ERP",
  description: "Contact Biznify ERP experts for support, demos, and custom solutions.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site text-center">
          <h1 className="section-title">Let&apos;s have a talk</h1>
          <p className="section-sub">
            Contact our experts if you have a problem. Our experts are always ready to
            help you. We are available 24/7.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div className="rounded-4xl border border-line bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-title">Corporate Office</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Aakash Tower, Level- 18, 54 Gulshan Avenue, Dhaka-1212, Bangladesh
            </p>
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-title">Quick Contact</h3>
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-4xl border border-line bg-white p-8 shadow-soft">
              <h3 className="text-lg font-semibold text-title">
                Need Assistance? Reach out to an Expert!
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                We understand that your time is valuable, so we strive to provide quick
                and accurate support to ensure that you can get back to running your
                business as soon as possible.
              </p>
              <Link href="/demo-request" className="btn-solid mt-5 inline-flex">
                Submit a ticket
              </Link>
            </div>

            <div className="rounded-4xl border border-line bg-white p-8 shadow-soft">
              <h3 className="text-lg font-semibold text-title">
                Are you looking for a Customized Solution at an affordable price?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                We understand that every business is unique and that&apos;s why we offer
                customized solutions that match your specific needs.
              </p>
              <a href="tel:+880000000000" className="btn-outline mt-5 inline-flex !rounded-lg">
                Call now
              </a>
            </div>

            <div className="rounded-4xl bg-brand-gradient p-8 text-white">
              <h3 className="text-lg font-semibold">Join our community</h3>
              <p className="mt-3 text-sm text-white/80">
                Connect with us instantly! Reach out to us via Facebook & LinkedIn for
                quick and convenient communication.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/biznify.net"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-secondary"
                >
                  Join Facebook
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium"
                >
                  Join LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={homeFaqs} />
      <CTABanner />
    </>
  );
}
