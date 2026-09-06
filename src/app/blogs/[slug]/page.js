import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogs } from "../../../data/site";
import CTABanner from "../../../components/CTABanner";

export function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = blogs.find((item) => item.slug === params.slug);
  if (!post) return { title: "Blog | Biznify" };
  return {
    title: `${post.title} | Biznify Blog`,
    description: post.excerpt,
  };
}

export default function BlogDetailsPage({ params }) {
  const post = blogs.find((item) => item.slug === params.slug);
  if (!post) notFound();

  const related = blogs.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <>
      <section className="bg-hero-glow py-12 md:py-16">
        <div className="container-site max-w-4xl">
          <div className="mb-4 flex gap-3 text-sm text-muted">
            <span>{post.date}</span>
            <span>•</span>
            <span>Admin</span>
          </div>
          <h1 className="text-3xl font-semibold text-title md:text-4xl">{post.title}</h1>
          <p className="mt-4 text-muted">{post.excerpt}</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site max-w-4xl">
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-4xl">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
          <article className="space-y-4 text-base leading-relaxed text-muted">
            <p>
              {post.excerpt} Biznify helps Bangladeshi businesses move from scattered
              spreadsheets to a connected ERP system covering accounting, inventory,
              sales, HR, and more.
            </p>
            <p>
              In this guide, we break down the practical steps teams can take to improve
              visibility, reduce duplicate work, and make faster decisions with cleaner
              data. Whether you are an SME, retailer, manufacturer, or service business,
              the same principle applies: enter data once and let connected modules keep
              everything in sync.
            </p>
            <p>
              If you want hands-on help applying these ideas inside Biznify, start a free
              trial or schedule a demo with our local support team.
            </p>
          </article>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/account/register" className="btn-solid">
              Start 30-Day Trial
            </Link>
            <Link href="/blogs" className="btn-outline !rounded-lg">
              Back to Blogs
            </Link>
          </div>

          <div className="mt-14">
            <h2 className="mb-6 text-2xl font-semibold text-title">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blogs/${item.slug}`}
                  className="rounded-3xl border border-line p-4 shadow-soft"
                >
                  <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <h3 className="text-sm font-semibold text-title line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
