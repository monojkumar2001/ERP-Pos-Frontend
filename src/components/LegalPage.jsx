import CTABanner from "./CTABanner";

export default function LegalPage({ title, sections = [] }) {
  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site max-w-3xl text-center">
          <h1 className="section-title">{title}</h1>
        </div>
      </section>
      <section className="pb-16">
        <div className="container-site max-w-3xl space-y-6">
          {sections.map((section) => (
            <div
              key={section.heading}
              className="rounded-3xl border border-line bg-white p-6 shadow-soft"
            >
              <h2 className="text-lg font-semibold text-title">{section.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
      <CTABanner />
    </>
  );
}
