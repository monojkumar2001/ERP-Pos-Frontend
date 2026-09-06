import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-brand-gradient py-14 text-white">
      <div className="container-site flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Have Questions? Talk to Our ERP Team Today
          </h2>
          <p className="mt-2 max-w-xl text-white/85">
            Just exploring ERP or unsure which modules you need? The Biznify team’s here
            with straight answers.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/schedule-your-demo"
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-secondary"
          >
            Talk to Expert Now
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full border border-white/50 px-6 py-3 text-sm font-medium text-white"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
