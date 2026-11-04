import SiteShell from "@/components/SiteShell";
import NotFoundContent from "@/app/(site)/not-found";

// Adresses inconnues hors du groupe (site) : même page, avec l'en-tête de la boutique.
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
