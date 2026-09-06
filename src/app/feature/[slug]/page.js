import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { features, blogs, homeFaqs, IMG } from "../../../data/site";
import FAQ from "../../../components/FAQ";
import CTABanner from "../../../components/CTABanner";

export function generateStaticParams() {
  return features.map((feature) => ({ slug: feature.slug }));
}

export function generateMetadata({ params }) {
  const feature = features.find((item) => item.slug === params.slug);
  if (!feature) return { title: "Feature | Biznify" };
  return {
    title: `${feature.title} Software | Biznify ERP`,
    description: feature.description,
  };
}

export default function FeaturePage({ params }) {
  const feature = features.find((item) => item.slug === params.slug);
  if (!feature) notFound();

  const others = features.filter((item) => item.slug !== feature.slug);

  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image src={feature.icon} alt="" width={48} height={48} />
              <span className="badge-pill">{feature.title}</span>
            </div>
            <h1 className="text-3xl font-semibold text-title md:text-[39px] md:leading-tight">
              {feature.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-muted">{feature.heroDesc}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pricing" className="btn-primary !rounded-lg">
                Pricing & Plan
              </Link>
              <Link href="/demo-request" className="btn-outline !rounded-lg">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-4xl border border-line bg-white p-4 shadow-card">
            <Image
              src={`${IMG}/storage/files/1/home/biznify-home-dashboard.webp`}
              alt={feature.title}
              width={720}
              height={460}
              className="h-auto w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feature.modules.map((module) => (
              <div key={module.title} className="card-feature">
                <h3 className="text-lg font-semibold text-primary">{module.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title text-left">
              Why Businesses Use the {feature.title} Module?
            </h2>
            <p className="mt-4 text-muted">
              A reliable {feature.title.toLowerCase()} system helps businesses manage
              records while staying connected with daily operations.
            </p>
            <ul className="mt-6 space-y-3">
              {feature.whyUse.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-title">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-4xl border border-line bg-white p-8 shadow-soft">
            <h3 className="text-xl font-semibold text-title">
              Manage Your Business {feature.title}
            </h3>
            <div className="mt-6 space-y-4">
              {feature.modules.slice(0, 4).map((module) => (
                <div key={module.title} className="rounded-2xl bg-soft p-4">
                  <h4 className="font-semibold text-title">{module.title}</h4>
                  <p className="mt-1 text-sm text-muted">{module.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQ
        items={homeFaqs.slice(0, 6)}
        title={`${feature.title} Faqs`}
        subtitle=""
      />

      <section className="py-16">
        <div className="container-site">
          <div className="mb-8 text-center">
            <h2 className="section-title">Stay update with blogs</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-title line-clamp-2">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container-site">
          <div className="mb-8 text-center">
            <h2 className="section-title">Explore Other features</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <Link key={item.slug} href={item.href} className="card-feature">
                <Image src={item.icon} alt="" width={48} height={48} />
                <h3 className="mt-4 text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-3">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
