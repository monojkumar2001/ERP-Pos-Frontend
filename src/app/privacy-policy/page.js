import LegalPage from "../../components/LegalPage";

export const metadata = {
  title: "Privacy Policy | Biznify",
  description: "Biznify privacy policy and data handling practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        {
          heading: "Overview",
          body: "Biznify respects your privacy and is committed to protecting business and personal information collected through our website and ERP services.",
        },
        {
          heading: "Information We Collect",
          body: "We may collect contact details, business information, usage data, and support communications needed to provide ERP services, demos, and customer support.",
        },
        {
          heading: "How We Use Information",
          body: "Information is used to deliver services, improve product experience, process demo or trial requests, and communicate important updates related to your account.",
        },
        {
          heading: "Data Security",
          body: "Biznify uses access controls, secure handling practices, and operational safeguards to reduce unauthorized access and protect business data.",
        },
        {
          heading: "Contact",
          body: "For privacy-related questions, contact the Biznify team through the Contact page or your assigned support channel.",
        },
      ]}
    />
  );
}
