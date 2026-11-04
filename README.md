# Soumaya Boutique

Site de Soumaya Boutique (Dakar), prévu sur **soumayaboutique.com** : catalogue de tissus, parfums,
chaussures et accessoires, liste de commande envoyée sur WhatsApp, et back-office sur `/admin`.
Aucun paiement en ligne pour l'instant.

## Lancer en local

```bash
npm install
cp env.example .env.local
npm run dev
```

Le site s'ouvre sur http://localhost:3000, le back-office sur http://localhost:3000/admin.

## Relier le back-office (Sanity)

1. Créer un compte gratuit sur https://www.sanity.io, puis un projet vide (dataset `production`).
2. Copier l'**ID du projet** (sanity.io/manage) dans `.env.local` : `NEXT_PUBLIC_SANITY_PROJECT_ID=…`.
3. Dans sanity.io/manage → API → CORS origins, autoriser `http://localhost:3000` puis
   `https://soumayaboutique.com` (cocher « Allow credentials »).
4. Relancer `npm run dev` et se connecter sur `/admin`.
5. Inviter les autres utilisateurs dans sanity.io/manage → Members.

Sans ID de projet, le site affiche le catalogue de secours de `lib/fallback.ts`.

## Ce qui se gère dans l'admin

- **Produits** : photos, prix ou prix par option (métrage, contenance, pointure), stock, mis en avant, nouveauté.
- **Catégories** : nom, photo, accroche, ordre d'affichage.
- **Infos boutique** : WhatsApp, adresse, horaires, Google Maps, réseaux, texte et photo d'accueil,
  produit à la une, questions fréquentes.
- **Notre histoire** : titre, photo, paragraphes.
- **Commandes** : rangées par statut (prévu, l'enregistrement depuis le site reste à faire).

Les pages se mettent à jour au plus tard une minute après une publication dans l'admin.

## Organisation

- `sanity/` et `sanity.config.ts` : modèles de contenu et menu de l'admin.
- `lib/catalogue.ts`, `lib/site.ts` : lecture des produits et des infos boutique.
- `lib/format.ts` : prix en FCFA et liens WhatsApp, utilisables partout.
- `lib/order.tsx` : liste de commande (gardée dans le navigateur) et message WhatsApp.
- `app/(site)/` : pages de la boutique ; `app/admin/` : back-office.
