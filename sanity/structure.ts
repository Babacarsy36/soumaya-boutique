import type { StructureResolver } from "sanity/structure";
import { orderStatuses } from "./schemaTypes/order";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Soumaya Boutique")
    .items([
      S.listItem()
        .title("Commandes")
        .child(
          S.list()
            .title("Commandes")
            .items([
              ...orderStatuses.map((status) =>
                S.listItem()
                  .title(status.title)
                  .child(
                    S.documentList()
                      .title(`Commandes · ${status.title}`)
                      .schemaType("order")
                      .filter('_type == "order" && coalesce(status, "nouvelle") == $status')
                      .params({ status: status.value })
                      .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                      .canHandleIntent(() => false),
                  ),
              ),
              S.divider(),
              S.documentTypeListItem("order").title("Toutes les commandes"),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("product").title("Produits"),
      S.documentTypeListItem("category").title("Catégories"),
      S.divider(),
      S.listItem()
        .title("Infos boutique")
        .id("settings")
        .child(S.document().schemaType("settings").documentId("settings").title("Infos boutique")),
      S.listItem()
        .title("Notre histoire")
        .id("about")
        .child(S.document().schemaType("about").documentId("about").title("Notre histoire")),
    ]);
