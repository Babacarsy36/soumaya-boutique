import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Catégorie",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description: "Partie de l'adresse web, par exemple « tissus ». Cliquer sur Générer.",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", title: "Phrase d'accroche", type: "string" }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      description: "Les plus petits nombres s'affichent en premier.",
      type: "number",
      initialValue: 10,
    }),
  ],
  orderings: [{ title: "Ordre d'affichage", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "tagline", media: "image" } },
});
