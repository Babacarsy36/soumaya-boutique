import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { OrderProvider } from "@/lib/order";
import { getSettings } from "@/lib/site";

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <OrderProvider whatsapp={settings.whatsapp}>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Reveal />
      </div>
    </OrderProvider>
  );
}
