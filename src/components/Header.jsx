"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { features, IMG } from "../data/site";

const resourceLinks = [
  { label: "Blog", href: "/blogs" },
  { label: "Changelog", href: "/change-log" },
  { label: "Mobile Apps", href: "/mobile-apps" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [openFeatures, setOpenFeatures] = useState(false);
  const [openResources, setOpenResources] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenFeatures(false);
    setOpenResources(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-[999] transition-all duration-200 ${
        scrolled
          ? "header-sticky"
          : "border-b border-[#f5f3f9] bg-white"
      }`}
    >
      <div className="container-site flex h-[67px] items-center justify-between">
        <Link href="/" className="relative h-[43px] w-[120px] shrink-0">
          <Image
            src={`${IMG}/storage/files/1/home/biznify-logo.svg`}
            alt="Biznify"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className={`text-base font-medium transition hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-title"
            }`}
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setOpenFeatures(true)}
            onMouseLeave={() => setOpenFeatures(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-base font-medium text-title transition hover:text-primary"
              onClick={() => setOpenFeatures((v) => !v)}
            >
              Features
              <svg
                className={`h-3.5 w-3.5 transition ${openFeatures ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openFeatures && (
              <div className="absolute left-0 top-full z-50 w-64 pt-3">
                <div className="rounded-2xl border border-line bg-white p-2 shadow-nav">
                  {features.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-title transition hover:bg-soft hover:text-primary"
                    >
                      <Image src={item.icon} alt="" width={28} height={28} />
                      {item.shortTitle}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/addons"
            className={`text-base font-medium transition hover:text-primary ${
              pathname === "/addons" ? "text-primary" : "text-title"
            }`}
          >
            Addons
          </Link>
          <Link
            href="/pricing"
            className={`text-base font-medium transition hover:text-primary ${
              pathname === "/pricing" ? "text-primary" : "text-title"
            }`}
          >
            Pricing
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setOpenResources(true)}
            onMouseLeave={() => setOpenResources(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-base font-medium text-title transition hover:text-primary"
              onClick={() => setOpenResources((v) => !v)}
            >
              Resources
              <svg
                className={`h-3.5 w-3.5 transition ${openResources ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openResources && (
              <div className="absolute left-0 top-full z-50 w-52 pt-3">
                <div className="rounded-2xl border border-line bg-white p-2 shadow-nav">
                  {resourceLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-3 py-2.5 text-[15px] font-medium text-title transition hover:bg-soft hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/account/register" className="btn-header hidden sm:inline-flex">
            Start 30-Day Trial
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-primary lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-white lg:hidden">
          <div className="container-site space-y-1 py-4">
            <Link href="/" className="block rounded-lg px-3 py-2.5 text-sm font-medium">
              Home
            </Link>
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Features
            </p>
            {features.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              >
                <Image src={item.icon} alt="" width={22} height={22} />
                {item.shortTitle}
              </Link>
            ))}
            <Link href="/addons" className="block rounded-lg px-3 py-2.5 text-sm font-medium">
              Addons
            </Link>
            <Link href="/pricing" className="block rounded-lg px-3 py-2.5 text-sm font-medium">
              Pricing
            </Link>
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Resources
            </p>
            {resourceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/account/register" className="btn-header mt-3 w-full">
              Start 30-Day Trial →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
