import Link from "next/link";
import { features, industries, blogs } from "../../data/site";
import CTABanner from "../../components/CTABanner";

export const metadata = {
  title: "Sitemap | Biznify",
  description: "Browse all Biznify website pages and resources.",
};

export default function SitemapPage() {
  const main = [
    { label: "Home", href: "/" },
    { label: "Addons", href: "/addons" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Demo Request", href: "/demo-request" },
    { label: "Schedule Demo", href: "/schedule-your-demo" },
    { label: "Mobile Apps", href: "/mobile-apps" },
    { label: "Blogs", href: "/blogs" },
    { label: "Changelog", href: "/change-log" },
    { label: "Templates", href: "/templates" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Cookie Notice", href: "/cookie-notice" },
    { label: "Terms of Use", href: "/terms-use" },
  ];

  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site text-center">
          <h1 className="section-title">Sitemap</h1>
          <p className="section-sub">Find every major page on the Biznify website.</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <SitemapCol title="Main Pages" links={main} />
          <SitemapCol
            title="Features"
            links={features.map((f) => ({ label: f.title, href: f.href }))}
          />
          <SitemapCol
            title="Industries"
            links={industries.map((i) => ({ label: i.title, href: i.href }))}
          />
          <SitemapCol
            title="Blogs"
            links={blogs.map((b) => ({
              label: b.title,
              href: `/blogs/${b.slug}`,
            }))}
          />
        </div>
      </section>

      <CTABanner />
    </>
  );
}

function SitemapCol({ title, links }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-title">{title}</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted transition hover:text-primary line-clamp-2"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
