import LegalPage from "../../components/LegalPage";

export const metadata = {
  title: "Terms of Use | Biznify",
  description: "Terms of use for the Biznify website and related resources.",
};

export default function TermsUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      sections={[
        {
          heading: "Website Content",
          body: "Content on biznify.net is provided for informational and product presentation purposes. Features and pricing may change over time.",
        },
        {
          heading: "Acceptable Use",
          body: "Do not misuse the website, attempt unauthorized access, or use content in ways that violate applicable laws.",
        },
        {
          heading: "Intellectual Property",
          body: "Biznify branding, product screenshots, and website materials remain the property of Softifybd Ltd. and its licensors.",
        },
      ]}
    />
  );
}
