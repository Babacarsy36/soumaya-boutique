# Mise en ligne sur soumayaboutique.com

Hébergement : Netlify (formule gratuite, usage commercial autorisé). Domaine et DNS : LWS.
Back-office : Sanity, projet `1egox1uk`, dataset `production`.

## 1. Code sur GitHub

Pousser la branche `main` sur un dépôt GitHub (nouveau dépôt, ou remplacement de
`Babacarsy36/soumaya-boutique`). Le fichier `.env.local` n'est jamais poussé.

## 2. Site Netlify

1. app.netlify.com → **Add new site** → **Import an existing project** → GitHub → choisir le dépôt.
   Variante : sur l'ancien site `soumayaboutique` → **Site configuration** → **Build & deploy** →
   **Link repository**, pour garder l'adresse soumayaboutique.netlify.app.
2. Les réglages de build sont lus dans `netlify.toml` : rien à changer.
3. **Site configuration** → **Environment variables** → ajouter :

   | Variable | Valeur | Secrète |
   |---|---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `1egox1uk` | non |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` | non |
   | `SANITY_WRITE_TOKEN` | valeur de `.env.local` | **oui** (cocher « Contains secret values ») |
   | `NEXT_PUBLIC_WHATSAPP` | facultatif, le numéro se règle dans l'admin | non |

4. **Deploys** → **Trigger deploy**. Vérifier le site sur l'adresse `….netlify.app` avant de toucher au DNS.

## 3. Domaine

1. Netlify → **Domain management** → **Add a domain** → `soumayaboutique.com`
   (choisir de garder le DNS chez LWS, pas « Netlify DNS »). Ajouter aussi `www.soumayaboutique.com`.
2. Netlify affiche les enregistrements à créer. Valeurs habituelles :

   | Type | Nom | Valeur |
   |---|---|---|
   | A | `@` (soumayaboutique.com) | `75.2.60.5` |
   | CNAME | `www` | `<nom-du-site>.netlify.app` |

   **Toujours recopier les valeurs affichées par Netlify**, elles priment sur ce tableau.
3. Espace client LWS → domaine → **Zone DNS** : remplacer l'enregistrement A de `@` et créer ou
   remplacer le CNAME `www`. **Ne pas toucher aux enregistrements MX ni TXT** (e-mails).
4. Attendre la propagation (quelques minutes à quelques heures). Netlify active ensuite le
   certificat HTTPS gratuit (**HTTPS** → **Verify DNS configuration**).

## 4. Sanity

1. Autoriser le domaine dans les CORS, avec « Allow credentials », pour que `/admin` fonctionne en ligne :
   `https://soumayaboutique.com` (et `https://<nom-du-site>.netlify.app` pour les tests).
2. sanity.io/manage → **Members** : inviter Soumaya et l'équipe (rôle Editor ; Administrator pour Soumaya).

## 5. Vérifications après mise en ligne

- Accueil, boutique, une fiche produit, Notre histoire, Nous trouver.
- `/admin` : connexion, modification d'un prix, visible sur le site en moins d'une minute.
- Une commande test envoyée depuis le site apparaît dans **Commandes**, puis la supprimer.
- https://soumayaboutique.com/sitemap.xml et /robots.txt répondent.
- Déclarer le site dans Google Search Console et créer la fiche Google Business de la boutique.
