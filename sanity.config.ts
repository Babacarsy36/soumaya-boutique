"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { frFRLocale } from "@sanity/locale-fr-fr";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, singletons } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "soumaya",
  title: "Soumaya Boutique",
  basePath: "/admin",
  projectId: projectId || "a-configurer",
  dataset,
  apiVersion,
  plugins: [structureTool({ structure }), frFRLocale()],
  schema: {
    types: schemaTypes,
    // Pas de bouton « Créer » pour les fiches uniques ni pour les commandes (créées par le site).
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletons.includes(schemaType) && schemaType !== "order"),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletons.includes(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
