import { Poppins } from "next/font/google";
import DashboardShell from "../../components/(Dashboard)/DashboardShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Biznify",
  description: "Biznify ERP Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <div className={`${poppins.variable} font-poppins`}>
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
