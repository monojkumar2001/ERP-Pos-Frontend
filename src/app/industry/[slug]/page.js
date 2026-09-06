import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { industries, features, homeFaqs, IMG } from "../../../data/site";
import FAQ from "../../../components/FAQ";
import CTABanner from "../../../components/CTABanner";

export function generateStaticParams() {
  return industries.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }) {
  const industry = industries.find((item) => item.slug === params.slug);
  if (!industry) return { title: "Industry | Biznify" };
  return {
    title: `ERP for ${industry.title} | Biznify`,
    description: industry.desc,
  };
}

export default function IndustryPage({ params }) {
  const industry = industries.find((item) => item.slug === params.slug);
  if (!industry) notFound();

  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Image src={industry.icon} alt="" width={64} height={64} />
            <h1 className="mt-5 text-3xl font-semibold text-title md:text-[39px]">
              ERP for {industry.title}
            </h1>
            <p className="mt-4 max-w-xl text-muted">{industry.desc}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/account/register" className="btn-primary !rounded-lg">
                Start 30-Day Trial
              </Link>
              <Link href="/schedule-your-demo" className="btn-outline !rounded-lg">
                Request a demo
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-4xl border border-line bg-white p-4 shadow-card">
            <Image
              src={`${IMG}/storage/files/1/home-benefit/biznify-erp-laptop-min.webp`}
              alt={industry.title}
              width={720}
              height={480}
              className="h-auto w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="section-title">Modules that power {industry.title}</h2>
            <p className="section-sub">
              Combine the Biznify modules you need to run operations, finance, and growth
              from one platform.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link key={feature.slug} href={feature.href} className="card-feature">
                <Image src={feature.icon} alt="" width={48} height={48} />
                <h3 className="mt-4 text-lg font-semibold text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-3">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {[
            "Centralized operations for every branch and team",
            "Real-time inventory, sales, and finance visibility",
            "Local support with Bangla-friendly workflows",
          ].map((text) => (
            <div key={text} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
              <p className="text-base font-medium text-title">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <FAQ items={homeFaqs.slice(0, 6)} />
      <CTABanner />
    </>
  );
}
