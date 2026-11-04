import type { Viewport } from "next";
import SiteShell from "@/components/SiteShell";

export const viewport: Viewport = { themeColor: "#f8f3eb" };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
