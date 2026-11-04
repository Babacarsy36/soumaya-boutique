import { defineArrayMember, defineField, defineType } from "sanity";

export const orderStatuses = [
  { title: "Nouvelle", value: "nouvelle" },
  { title: "Confirmée", value: "confirmee" },
  { title: "Livrée", value: "livree" },
  { title: "Annulée", value: "annulee" },
];

// Les commandes sont créées par le site quand un client les envoie sur WhatsApp.
// Dans l'admin, seuls le statut et la note interne se modifient.
export const order = defineType({
  name: "order",
  title: "Commande",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: { list: orderStatuses, layout: "radio", direction: "horizontal" },
      initialValue: "nouvelle",
    }),
    defineField({ name: "internalNote", title: "Note interne", type: "text", rows: 2 }),
    defineField({
      name: "reference",
      title: "Référence",
      description: "Reprise dans le message WhatsApp du client.",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "customerName", title: "Client", type: "string", readOnly: true }),
    defineField({ name: "city", title: "Livraison", type: "string", readOnly: true }),
    defineField({ name: "note", title: "Remarque du client", type: "text", readOnly: true }),
    defineField({
      name: "lines",
      title: "Articles",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          name: "line",
          fields: [
            defineField({ name: "name", title: "Article", type: "string" }),
            defineField({ name: "slug", title: "Référence", type: "string" }),
            defineField({ name: "option", title: "Option", type: "string" }),
            defineField({ name: "quantity", title: "Quantité", type: "number" }),
            defineField({ name: "price", title: "Prix unitaire", type: "number" }),
          ],
          preview: {
            select: { name: "name", option: "option", quantity: "quantity" },
            prepare: ({ name, option, quantity }) => ({
              title: `${quantity} × ${name}`,
              subtitle: option,
            }),
          },
        }),
      ],
    }),
    defineField({ name: "total", title: "Total (FCFA)", type: "number", readOnly: true }),
  ],
  orderings: [{ title: "Plus récentes", name: "recent", by: [{ field: "_createdAt", direction: "desc" }] }],
  preview: {
    select: { ref: "reference", name: "customerName", city: "city", total: "total", status: "status", date: "_createdAt" },
    prepare: ({ ref, name, city, total, status, date }) => {
      const label = orderStatuses.find((s) => s.value === status)?.title ?? "Nouvelle";
      const day = date ? new Date(date).toLocaleDateString("fr-FR") : "";
      return {
        title: `${ref ?? ""} · ${name || "Client"} · ${new Intl.NumberFormat("fr-FR").format(total ?? 0)} FCFA`,
        subtitle: [label, city, day].filter(Boolean).join(" · "),
      };
    },
  },
});
