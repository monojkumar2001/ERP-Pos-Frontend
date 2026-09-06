import LegalPage from "../../components/LegalPage";

export const metadata = {
  title: "Cookie Notice | Biznify",
  description: "How Biznify uses cookies on its website.",
};

export default function CookieNoticePage() {
  return (
    <LegalPage
      title="Cookie Notice"
      sections={[
        {
          heading: "What Are Cookies",
          body: "Cookies are small text files stored on your device to help websites remember preferences and improve browsing experience.",
        },
        {
          heading: "How Biznify Uses Cookies",
          body: "We use cookies to understand traffic, remember settings, and improve website performance and content relevance.",
        },
        {
          heading: "Managing Cookies",
          body: "You can control or delete cookies through your browser settings. Disabling some cookies may affect site functionality.",
        },
      ]}
    />
  );
}
