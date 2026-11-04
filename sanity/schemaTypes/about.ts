import { defineArrayMember, defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "Notre histoire",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "paragraphs",
      title: "Texte",
      description: "Un bloc par paragraphe.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
  ],
  preview: { prepare: () => ({ title: "Notre histoire" }) },
});
