import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

// Les pages se mettent à jour au plus tard une minute après une modification dans l'admin.
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  if (!client) return null;
  return client.fetch<T>(query, params, { next: { revalidate: 60 } });
}
