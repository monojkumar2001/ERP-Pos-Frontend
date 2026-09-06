import ModulePage from "../../../../components/(Dashboard)/ModulePage";
import { allPagePaths } from "../../../../data/dashboard/pageConfigs";

export function generateStaticParams() {
  return allPagePaths()
    .filter((p) => p.startsWith("/en/") && p !== "/en/dashboard")
    .map((p) => ({
      path: p.replace(/^\/en\//, "").split("/"),
    }));
}

export function generateMetadata({ params }) {
  const pathname = `/en/${(params.path || []).join("/")}`;
  const title = pathname.split("/").filter(Boolean).pop() || "Biznify";
  return {
    title: `${title} | Biznify`,
  };
}

export default function CatchAllDashboardPage({ params }) {
  const pathname = `/en/${(params.path || []).join("/")}`;
  return <ModulePage pathname={pathname} />;
}
