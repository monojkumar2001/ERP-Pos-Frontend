"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  features,
  industries,
  testimonials,
  clients,
  integrations,
  blogs,
  homeFaqs,
  IMG,
} from "../data/site";
import PricingSection from "../components/PricingSection";
import CustomERP from "../components/CustomERP";
import FAQ from "../components/FAQ";
import CTABanner from "../components/CTABanner";
import LogoMarquee from "../components/LogoMarquee";

const rotatingWords = [
  "Business",
  "Inventory",
  "Accounting",
  "Sales",
  "POS",
  "Payroll",
  "Manufacturing",
];

const whyItems = [
  {
    title: "Centralized Control",
    desc: "Manage your entire business from a single, intuitive dashboard. Get real-time visibility into sales, inventory, HR, and finance with secure access controls and data protection.",
    icon: `${IMG}/storage/files/1/home-benefit/Icon-54.svg`,
  },
  {
    title: "Automation",
    desc: "Automates tasks like orders, payroll, and VAT, reducing errors and saving time.",
    icon: `${IMG}/storage/files/1/home-benefit/Icon-58.svg`,
  },
  {
    title: "Real-Time Insights",
    desc: "Get instant reports on sales, stock, and financials to guide decisions.",
    icon: `${IMG}/storage/files/1/home-benefit/Icon-62.svg`,
  },
  {
    title: "Scalable Solution",
    desc: "Grows with your business, from startup to enterprise, without requiring system changes.",
    icon: `${IMG}/storage/files/1/home-benefit/Icon-66.svg`,
  },
];

const appFeatures = [
  "Create invoices & sales orders",
  "Add customers, suppliers & items",
  "Real-time dashboard overview",
  "Track cash, bank, mobile wallet",
  "Transaction & report visibility",
  "Bangla currency supported",
];

const integrationPoints = [
  {
    title: "Auto-sync sales, inventory, and accounts",
    desc: "Changes reflect instantly across your entire business ecosystem",
    icon: `${IMG}/storage/files/1/home/Integration/sync.svg`,
  },
  {
    title: "25+ ready templates",
    desc: "Launch your online store quickly with industry-specific templates",
    icon: `${IMG}/storage/files/1/home/Integration/template.svg`,
  },
  {
    title: "100% Secured payment transaction",
    desc: "We ensure that every payment transaction 100% safe & secured",
    icon: `${IMG}/storage/files/1/home/Integration/secure-payment.svg`,
  },
  {
    title: "24/7 dedicated team support",
    desc: "Get 24/7 expert support from our specialized team",
    icon: `${IMG}/storage/files/1/home/Integration/support.svg`,
  },
];

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-glow pb-10 pt-14">
        <div className="container-site text-center">
          <span className="badge-pill">Bangladeshi #1 ERP Solution</span>
          <h1 className="hero-content-title mx-auto max-w-[845px] text-[32px] font-semibold leading-[1.3] text-title md:text-[39px] md:leading-[50.7px]">
            <span className="inline-flex flex-wrap items-center justify-center gap-3 whitespace-nowrap">
              Manage Your{" "}
              <b className="gradient-word">{rotatingWords[wordIndex]}</b>
            </span>
            <br />
            with Biznify
          </h1>
          <p className="mx-auto mt-0 max-w-[845px] px-0 text-base font-normal leading-[1.6] text-title md:px-20">
            All-in-one cloud ERP software in Bangladesh for accounting, inventory, HR,
            sales, manufacturing and more. Everything you need to run and grow your
            business.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/demo-request" className="btn-primary">
              Request a demo
            </Link>
            <Link href="/account/register" className="btn-outline">
              Start 30-Day Trial
            </Link>
          </div>

          <div className="relative mx-auto mt-12 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="flex items-center gap-3 border-b border-line bg-soft px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="mx-auto hidden max-w-md flex-1 rounded-md bg-white px-3 py-1.5 text-center text-xs text-muted sm:block">
                  www.biznify.net
                </div>
              </div>
              <div className="relative aspect-[872/570] w-full">
                <Image
                  src={`${IMG}/storage/files/1/home/biznify-home-dashboard.webp`}
                  alt="Manage Your Business with Biznify"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-[36px] text-white shadow-lg"
                  aria-label="Play video"
                >
                  <span className="ml-1">▶</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features intro */}
      <section className="py-12">
        <div className="container-site">
          <div className="mx-auto mb-2 max-w-[845px] text-center">
            <h2 className="section-title-lg">
              All in One ERP Software in Bangladesh for Modern Businesses
            </h2>
            <p className="section-sub !mt-4">
              Biznify provides a complete ERP system that centralizes all your business
              management needs in one place.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.slug} className="card-feature mt-[30px]">
                <div className="feature-icon-box">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] object-contain"
                  />
                </div>
                <h3 className="mb-3 text-[22px] font-bold leading-[1.4] text-secondary line-clamp-1">
                  {feature.title}
                </h3>
                <p className="line-clamp-3 text-[15px] font-normal leading-6 text-title">
                  {feature.description}
                </p>
                <Link href={feature.href} className="link-more">
                  Learn more
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecommerce integration */}
      <section className="bg-soft py-12 md:py-16">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-[845px] text-center">
            <h2 className="section-title-secondary">Connect ERP with Your Online Store</h2>
            <p className="section-sub">
              Biznify works with GetCommerce so your ERP and online shop stay in sync.
              Update products, track sales, and manage orders without switching tabs.
            </p>
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-6">
            <Image
              src={`${IMG}/storage/files/1/home/biznify-logo-1.webp`}
              alt="Biznify"
              width={130}
              height={48}
            />
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary shadow-soft">
              <Image
                src={`${IMG}/frontend_assets/images/integrated/integrated-icon.svg`}
                alt=""
                width={28}
                height={28}
              />
              Integrated
            </div>
            <Image
              src={`${IMG}/storage/files/1/home/GetCommerce-Logo-1.webp`}
              alt="GetCommerce"
              width={160}
              height={40}
            />
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-soft">
              <Image
                src={`${IMG}/storage/files/1/home/biznify-dashboard-integrated.webp`}
                alt="Biznify dashboard"
                width={542}
                height={426}
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-soft">
              <Image
                src={`${IMG}/storage/files/1/home/Getcommerce-Ecommerce.webp`}
                alt="GetCommerce store"
                width={542}
                height={426}
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {integrationPoints.map((item) => (
              <div key={item.title} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
                <Image src={item.icon} alt="" width={48} height={48} />
                <h3 className="mt-4 text-base font-semibold text-title">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />
      <CustomERP />

      {/* Why Biznify */}
      <section className="py-16 md:py-20">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="section-title">
              Why Biznify is the Best ERP Software in Bangladesh?
            </h2>
            <p className="section-sub">
              Experience the power of an integrated ERP solution that brings clarity to
              your operations, boosts productivity, and drives growth.
            </p>
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-4xl">
              <Image
                src={`${IMG}/storage/files/1/home-benefit/biznify-erp-laptop-min.webp`}
                alt="Why Biznify"
                width={640}
                height={480}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="space-y-5">
              {whyItems.map((item, index) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-line p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-lg font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Image src={item.icon} alt="" width={20} height={20} />
                      <h3 className="text-lg font-semibold text-title">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
              <Link href="/account/register" className="btn-solid mt-2 inline-flex">
                Start 30-Day Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile app */}
      <section className="bg-soft py-16 md:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title text-left">
              Run Your Business Anytime, Anywhere with the Biznify App
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              With the Biznify app, you can view reports, send invoices, and manage sales
              from anywhere. It’s your ERP system on the go.
            </p>
            <ul className="mt-6 space-y-3">
              {appFeatures.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-title">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn-solid"
              >
                Play Store
              </a>
              <Link href="/mobile-apps" className="btn-outline !rounded-lg !px-4 !py-2.5">
                Explore APP Features
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <Image
              src={`${IMG}/storage/files/1/home/mobile-app-frame.webp`}
              alt="Biznify mobile app"
              width={420}
              height={560}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-[845px] text-center">
            <h2 className="section-title">What Customer Say</h2>
            <p className="section-sub">
              From retail to manufacturing, companies rely on Biznify’s ERP solution to
              stay organized and grow faster.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl bg-[#f9fafb] p-6"
              >
                <div className="mb-2 flex gap-0.5 text-[24px] text-[#ffbe3d]">
                  ★★★★★
                </div>
                <p className="text-sm leading-relaxed text-title">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border-2 border-transparent bg-white object-contain p-0.5 outline outline-1 outline-primary"
                  />
                  <div>
                    <p className="text-base font-semibold leading-[18px] text-title">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-[#4b5563]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-[#e5f6fc] py-12">
        <div className="container-site">
          <h2 className="mb-4 text-center text-[28px] font-bold text-secondary md:mb-10 md:text-[32px]">
            30+ Intergrations
          </h2>
        </div>
        <LogoMarquee items={integrations} variant="integration" speed={30} />
      </section>

      {/* Industries */}
      <section className="py-16 md:py-20">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="section-title">ERP for Every Industry in Bangladesh</h2>
            <p className="section-sub">
              Listen to our customers how they calculate and track their business
              transactions using Financfy.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="card-feature flex flex-col items-center text-center"
              >
                <Image src={item.icon} alt="" width={56} height={56} />
                <h3 className="mt-4 text-base font-semibold text-title">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="bg-[#e5f6fc] py-12">
        <div className="container-site">
          <h2 className="mb-10 text-center text-[28px] font-bold text-secondary md:text-[32px]">
            Trusted by 500+ Clients
          </h2>
        </div>
        <LogoMarquee items={clients} variant="client" speed={28} />
      </section>

      <FAQ items={homeFaqs} />

      {/* Blogs */}
      <section className="py-16 md:py-20">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="section-title">Stay Informed with Our Blogs</h2>
            <p className="section-sub">
              Read expert ERP guides, industry tips, and case studies on how businesses
              succeed.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 6).map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex gap-3 text-xs text-muted">
                    <span>{post.date}</span>
                    <span>Admin</span>
                  </div>
                  <h3 className="text-base font-semibold text-title line-clamp-2">
                    {post.title}
                  </h3>
                  <span className="link-more mt-3">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
