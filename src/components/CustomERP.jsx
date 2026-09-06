import Link from "next/link";
import Image from "next/image";
import { IMG } from "../data/site";

const benefits = [
  {
    title: "Advanced Module Customization",
    desc: "Modules & dashboards designed around your business needs",
    icon: `${IMG}/storage/files/1/home-cta-2/Vector.svg`,
  },
  {
    title: "Scalable & Flexible",
    desc: "Add new features as your business expands",
    icon: `${IMG}/storage/files/1/home-cta-2/Icon-120.svg`,
  },
  {
    title: "Simple & User-Friendly",
    desc: "Less training, faster adoption",
    icon: `${IMG}/storage/files/1/home-cta-2/Icon-131.svg`,
  },
  {
    title: "Seamless Integration",
    desc: "Finance, HR, Sales & Inventory in one platform",
    icon: `${IMG}/storage/files/1/home-cta-2/Icon-131.svg`,
  },
];

const stats = [
  {
    label: "ROI Increase",
    value: "185%",
    icon: `${IMG}/storage/files/1/home/Industry-solution/layer.svg`,
    className: "right-4 top-8",
  },
  {
    label: "Monthly Sales",
    value: "+24.5%",
    icon: `${IMG}/storage/files/1/home/Industry-solution/chart-up.svg`,
    className: "bottom-24 left-4",
  },
  {
    label: "Team Efficiency",
    value: "+85%",
    icon: `${IMG}/storage/files/1/home/Industry-solution/team.svg`,
    className: "bottom-8 right-8",
  },
];

export default function CustomERP() {
  return (
    <section className="industry-solution-area relative overflow-hidden bg-[#e5f6fc] py-12">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-5">
              <span className="relative mb-5 inline-block pl-20 text-lg font-bold leading-[1.2] text-title before:absolute before:left-0 before:top-[10px] before:h-0.5 before:w-[72px] before:bg-primary">
                INDUSTRY-SPECIFIC SOLUTIONS
              </span>
              <h2 className="text-[32px] font-bold leading-tight text-title md:text-[36px]">
                Custom ERP – Built Around Your Business
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-title">
                Biznify builds Custom ERP tailored to your KPIs, reports, and workflows so
                your system grows exactly the way your business grows.
              </p>
            </div>

            <div className="space-y-5">
              {benefits.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-soft">
                    <Image src={item.icon} alt={item.title} width={22} height={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-title">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-[15px] font-medium text-[#fafbfc] transition hover:bg-secondary"
              >
                Submit Requirements
              </Link>
              <Link
                href="/schedule-your-demo"
                className="inline-flex items-center justify-center rounded-lg border border-primary bg-transparent px-8 py-3.5 text-[15px] font-medium text-primary transition hover:bg-primary hover:text-white"
              >
                Schedule a Meeting
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <Image
              src={`${IMG}/storage/files/1/image_2025-05-21_20-19-32.webp`}
              alt="solution-img"
              width={560}
              height={560}
              className="h-auto w-full object-contain"
            />
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`absolute ${stat.className} rounded-2xl bg-white px-4 py-3 shadow-card`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light">
                    <Image src={stat.icon} alt={stat.label} width={18} height={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted">{stat.label}</p>
                    <p className="text-lg font-bold text-secondary">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
