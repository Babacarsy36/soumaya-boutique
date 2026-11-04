export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-11-01";

// Sans ID de projet, le site affiche le catalogue de secours de lib/fallback.ts.
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
