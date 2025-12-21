Changement de cap reçu : on remplace Firebase par Supabase.

Voici le plan mis à jour pour la refonte architecturale et la migration :

### 1. Nettoyage de Firebase
*   Désinstallation du package `firebase`.
*   Suppression des fichiers de configuration et utilitaires liés à Firebase (`lib/firebase.ts`, `lib/firestore.ts`, `FIREBASE_SETUP.md`).

### 2. Installation et Configuration de Supabase
*   Installation de `@supabase/supabase-js`.
*   Création d'un fichier de configuration `lib/supabase.ts` pour initialiser le client Supabase.
*   (Note : Vous devrez fournir les clés `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans votre fichier `.env.local`).

### 3. Restructuration Architecturale (Maintenue)
On applique toujours la meilleure organisation des dossiers :
*   **`services/`** : Création de ce dossier pour la logique métier.
    *   Réécriture de `services/products.service.ts` pour utiliser le client Supabase au lieu de Firestore.
    *   Adaptation de `services/storage.service.ts` pour Supabase Storage.
*   **`types/`** : Déplacement de `lib/types.ts` vers `types/index.ts`.
*   **`components/`** : Réorganisation.
    *   `layout/` : `Header.tsx`, `Footer.tsx`.
    *   `features/products/` : `ProductCard.tsx`.
    *   `ui/` : Composants génériques.

### 4. Mise à jour du code
*   Remplacement des appels Firebase par les appels Supabase dans les services.
*   Mise à jour des imports dans les composants et pages.

On commence par nettoyer et restructurer ?
