import { defineArrayMember, defineField, defineType } from "sanity";

type ProductDoc = { price?: number; option?: { choices?: unknown[] } };

export const product = defineType({
  name: "product",
  title: "Produit",
  type: "document",
  groups: [
    { name: "main", title: "Fiche", default: true },
    { name: "price", title: "Prix et options" },
    { name: "display", title: "Affichage" },
  ],
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description: "Cliquer sur Générer après avoir saisi le nom.",
      type: "slug",
      group: "main",
      options: { source: "name", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subCategory",
      title: "Sous-catégorie ou marque",
      description: "Par exemple Vlisco, Bazin, Femme, Sacs.",
      type: "string",
      group: "main",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4, group: "main" }),
    defineField({
      name: "images",
      title: "Photos",
      description: "La première photo est celle affichée dans la boutique.",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      options: { layout: "grid" },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Prix (FCFA)",
      description: "Laisser vide si le prix dépend d'une option ci-dessous.",
      type: "number",
      group: "price",
      validation: (r) =>
        r.min(0).custom((value, ctx) => {
          const doc = ctx.document as ProductDoc | undefined;
          return value !== undefined || doc?.option?.choices?.length
            ? true
            : "Indiquez un prix ou ajoutez des choix avec leur prix.";
        }),
    }),
    defineField({
      name: "option",
      title: "Option à choisir",
      description: "Métrage, contenance, pointure… Chaque choix a son propre prix.",
      type: "object",
      group: "price",
      fields: [
        defineField({ name: "label", title: "Nom de l'option", type: "string", placeholder: "Métrage" }),
        defineField({
          name: "choices",
          title: "Choix",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "choice",
              fields: [
                defineField({ name: "label", title: "Choix", type: "string", validation: (r) => r.required() }),
                defineField({ name: "price", title: "Prix (FCFA)", type: "number", validation: (r) => r.required().min(0) }),
              ],
              preview: { select: { title: "label", subtitle: "price" } },
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "inStock", title: "En stock", type: "boolean", group: "display", initialValue: true }),
    defineField({
      name: "featured",
      title: "Mis en avant",
      description: "Affiché dans « Les incontournables » sur l'accueil.",
      type: "boolean",
      group: "display",
      initialValue: false,
    }),
    defineField({
      name: "isNew",
      title: "Nouveauté",
      description: "Affiche le badge « Nouveau ».",
      type: "boolean",
      group: "display",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category.name", media: "images.0", inStock: "inStock" },
    prepare: ({ title, subtitle, media, inStock }) => ({
      title,
      subtitle: inStock === false ? `${subtitle ?? ""} · Épuisé` : subtitle,
      media,
    }),
  },
});
