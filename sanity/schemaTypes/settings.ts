import { defineArrayMember, defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Infos boutique",
  type: "document",
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "home", title: "Page d'accueil" },
    { name: "faq", title: "Questions fréquentes" },
  ],
  fields: [
    defineField({
      name: "whatsapp",
      title: "Numéro WhatsApp des commandes",
      description: "Format international sans + ni espaces, par exemple 221771234567.",
      type: "string",
      group: "contact",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "numéro" }).error("Chiffres uniquement, avec l'indicatif 221."),
    }),
    defineField({ name: "address", title: "Adresse", type: "string", group: "contact" }),
    defineField({
      name: "mapsUrl",
      title: "Lien Google Maps",
      description: "Bouton « Itinéraire » sur la page Nous trouver.",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "hours",
      title: "Horaires",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "hour",
          fields: [
            defineField({ name: "days", title: "Jours", type: "string", placeholder: "Lundi – Samedi" }),
            defineField({ name: "time", title: "Heures", type: "string", placeholder: "10h – 20h" }),
          ],
          preview: { select: { title: "days", subtitle: "time" } },
        }),
      ],
    }),
    defineField({ name: "instagram", title: "Lien Instagram", type: "url", group: "contact" }),
    defineField({ name: "tiktok", title: "Lien TikTok", type: "url", group: "contact" }),

    defineField({
      name: "heroText",
      title: "Texte d'accueil",
      description: "Sous le grand titre de la page d'accueil.",
      type: "text",
      rows: 3,
      group: "home",
    }),
    defineField({ name: "heroImage", title: "Grande photo d'accueil", type: "image", options: { hotspot: true }, group: "home" }),
    defineField({
      name: "spotlight",
      title: "Produit à la une",
      description: "Mis en avant sur la grande photo d'accueil.",
      type: "reference",
      to: [{ type: "product" }],
      group: "home",
    }),

    defineField({
      name: "faq",
      title: "Questions fréquentes",
      type: "array",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", title: "Réponse", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Infos boutique" }) },
});
