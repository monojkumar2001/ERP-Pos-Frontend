"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/account");
  const isDashboard = pathname?.startsWith("/en");

  if (isAuth || isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
