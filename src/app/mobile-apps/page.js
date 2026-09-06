import Link from "next/link";
import Image from "next/image";
import FAQ from "../../components/FAQ";
import CTABanner from "../../components/CTABanner";
import { homeFaqs, IMG } from "../../data/site";

export const metadata = {
  title: "Biznify Mobile Apps | Manage Business On the Go",
  description:
    "Download Biznify mobile apps to control inventory, sales, HR, and more from your smartphone.",
};

const highlights = [
  {
    title: "Inventory at Your Fingertips",
    desc: "Track stock, update item details, and manage product groups — all in real time. Stay organized and reduce stockouts with smarter inventory control.",
  },
  {
    title: "Mobile Accounting Made Easy",
    desc: "View invoices, check outstanding payments, and track transactions on the go. Our mobile accounting tools keep your business finances always accessible.",
  },
  {
    title: "Instant Business Reports",
    desc: "Access real-time data and smart reports directly from your phone. Whether it’s sales, payroll, or inventory insights — make faster decisions.",
  },
];

export default function MobileAppsPage() {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-semibold text-title md:text-[39px] md:leading-tight">
              Manage Your Business Anytime, Anywhere with Biznify Mobile Apps
            </h1>
            <p className="mt-4 text-muted">
              Download our mobile app to control inventory, sales, HR, and more — all from
              your smartphone.
            </p>
            <div className="mt-8 flex gap-6">
              <div>
                <p className="text-3xl font-bold text-primary">4.5/5</p>
                <p className="text-sm text-muted">On the Google Play</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">4.2/5</p>
                <p className="text-sm text-muted">On the App Store</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn-solid"
              >
                Play Store
              </a>
              <Link href="/demo-request" className="btn-outline !rounded-lg">
                Start Free Trial
              </Link>
            </div>
          </div>
          <div className="mx-auto max-w-md">
            <Image
              src={`${IMG}/storage/files/1/home/mobile-app-frame.webp`}
              alt="Biznify mobile apps"
              width={420}
              height={560}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="section-title">Biznify App – Run Your Business On the Go</h2>
            <p className="section-sub">
              Biznify Mobile Apps let you manage inventory, accounting, reporting, and
              team activity anytime, from anywhere.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="card-feature">
                <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div className="rounded-4xl border border-line bg-white p-8 shadow-soft">
            <h3 className="text-2xl font-semibold text-title">
              Easy to Manage Your All Data by This App
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Stay organized and productive with Biznify Mobile Apps. Access your
              inventory, sales, purchases, HR records, and financial data anytime — all
              from one secure and easy-to-use platform.
            </p>
          </div>
          <div className="rounded-4xl border border-line bg-white p-8 shadow-soft">
            <h3 className="text-2xl font-semibold text-title">
              Responsive Design for All Devices with Quality
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Biznify Mobile Apps are designed to deliver a smooth, responsive experience
              across all smartphones, tablets, and screen sizes.
            </p>
          </div>
        </div>
      </section>

      <FAQ items={homeFaqs.slice(0, 6)} />
      <CTABanner />
    </>
  );
}
