import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function AdminPage() {
  if (!isSanityConfigured) {
    return (
      <div style={{ fontFamily: "system-ui", maxWidth: 560, margin: "15vh auto", padding: 24, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 24 }}>Back-office pas encore relié</h1>
        <p>
          Renseignez <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> dans <code>.env.local</code> avec l’ID du
          projet Sanity, puis relancez le site.
        </p>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
