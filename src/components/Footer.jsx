import Link from "next/link";
import Image from "next/image";
import { IMG } from "../data/site";

const modules = [
  { label: "Accounting", href: "/feature/accounting-software" },
  { label: "Inventory Management", href: "/feature/inventory-management-software" },
  { label: "HR & Payroll", href: "/feature/hr-payroll-software" },
  { label: "Sales", href: "/feature/sales-software" },
  { label: "POS", href: "/feature/pos-software" },
  { label: "Manufacturing", href: "/feature/manufacturing-software" },
];

const quickLinks = [
  { label: "Addons", href: "/addons" },
  { label: "Pricing", href: "/pricing" },
  { label: "Templates", href: "/templates" },
  { label: "Mobile Apps", href: "/mobile-apps" },
  { label: "Customer Experience", href: "/blogs" },
  { label: "Request Demo", href: "/demo-request" },
];

const resources = [
  { label: "Blogs", href: "/blogs" },
  { label: "Learning", href: "/blogs" },
  { label: "Change Log", href: "/change-log" },
  { label: "Documentation", href: "/blogs" },
  { label: "Webinar", href: "/contact" },
  { label: "Case Studies", href: "/blogs" },
];

const company = [
  { label: "About us", href: "/contact" },
  { label: "Contact us", href: "/contact" },
  { label: "Request Demo", href: "/demo-request" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#0f2d45] text-white">
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="relative mb-5 block h-10 w-[130px]">
              <Image
                src={`${IMG}/storage/files/1/home/biznify-logo.svg`}
                alt="Biznify"
                fill
                className="object-contain object-left brightness-0 invert"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              All-in-one cloud ERP software in Bangladesh for accounting,
              inventory, HR, sales, manufacturing and more.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.facebook.com/biznify.net"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm hover:bg-primary"
              >
                f
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm hover:bg-primary"
              >
                in
              </a>
            </div>
          </div>

          <FooterCol title="Modules" links={modules} />
          <FooterCol title="Quick Links" links={quickLinks} />
          <FooterCol title="Resources" links={resources} />
          <FooterCol title="Company" links={company} />
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
          <div>
            <p className="mb-3 text-sm font-semibold">Download Our App</p>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Play Store
            </a>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Certifications</p>
            <div className="flex flex-wrap gap-3">
              {[
                `${IMG}/storage/files/1/basis.webp`,
                `${IMG}/storage/files/1/DUNS.webp`,
                `${IMG}/storage/files/1/iso1.webp`,
                `${IMG}/storage/files/1/iso2.webp`,
              ].map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt="certification"
                  width={48}
                  height={48}
                  className="rounded bg-white/90 object-contain p-1"
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Secure Payment</p>
            <Image
              src={`${IMG}/storage/files/1/accepted-payments.svg`}
              alt="Secure Payment"
              width={220}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Biznify. All Rights Reserved. Powered by Softifybd Ltd.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link href="/cookie-notice" className="hover:text-white">
              Cookie Notice
            </Link>
            <Link href="/terms-use" className="hover:text-white">
              Terms of Use
            </Link>
            <Link href="/sitemap" className="hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/70 transition hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
