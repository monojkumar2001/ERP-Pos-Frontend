import LegalPage from "../../components/LegalPage";

export const metadata = {
  title: "Terms & Conditions | Biznify",
  description: "Biznify terms and conditions for using our ERP services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      sections={[
        {
          heading: "Acceptance of Terms",
          body: "By accessing Biznify websites or using Biznify ERP services, you agree to these terms and applicable policies.",
        },
        {
          heading: "Service Use",
          body: "You agree to use Biznify only for lawful business purposes and to protect login credentials assigned to your organization.",
        },
        {
          heading: "Subscriptions & Billing",
          body: "Paid plans, trials, and addons are subject to the selected package terms. VAT and local taxes may apply where required.",
        },
        {
          heading: "Limitations",
          body: "Biznify provides the platform as described in your plan. Custom enterprise requirements may involve separate agreements.",
        },
        {
          heading: "Changes",
          body: "We may update these terms periodically. Continued use of the service after updates means you accept the revised terms.",
        },
      ]}
    />
  );
}
