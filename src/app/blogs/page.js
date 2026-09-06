import Link from "next/link";
import Image from "next/image";
import { blogs } from "../../data/site";
import CTABanner from "../../components/CTABanner";

export const metadata = {
  title: "Biznify Blog | ERP Guides & Insights",
  description: "Expert ERP guides, industry tips, and case studies from Biznify.",
};

export default function BlogsPage() {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site text-center">
          <h1 className="section-title">Stay Informed with Our Blogs</h1>
          <p className="section-sub">
            Read expert ERP guides, industry tips, and case studies on how businesses
            succeed.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative aspect-[16/10]">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <div className="mb-2 flex gap-3 text-xs text-muted">
                  <span>{post.date}</span>
                  <span>Admin</span>
                </div>
                <h2 className="text-base font-semibold text-title line-clamp-2">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
                <span className="link-more mt-3">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
