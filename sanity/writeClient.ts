import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

// Jeton d'écriture : variable serveur uniquement (jamais NEXT_PUBLIC_), utilisée pour enregistrer les commandes.
const token = process.env.SANITY_WRITE_TOKEN;

export const writeClient =
  isSanityConfigured && token
    ? createClient({ projectId, dataset, apiVersion, token, useCdn: false })
    : null;
