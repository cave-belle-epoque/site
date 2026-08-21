# Site Cave La Belle Époque — Eleventy + Decap CMS

Implémente l'architecture décrite dans [`../docs/architecture.md`](../docs/architecture.md).
Reprend la variante A de la maquette (`../maquette/index.html`), avec le
contenu qui change souvent (menu, événements, horaires) sorti dans
`content/` pour être piloté par Decap CMS plutôt qu'écrit en dur.

## Développer en local

```bash
npm install
npm start        # serveur de dev avec rechargement automatique
npm run build    # build de production dans _site/
```

## Où éditer le contenu

| Fichier | Contenu | Édité via |
|---|---|---|
| `content/menu.yml` | Menu de la semaine + ardoise | `/admin` → "Menu de la semaine" |
| `content/evenements/*.md` | Agenda (un fichier par événement, photo facultative) | `/admin` → "Événements" |
| `content/horaires.yml` | Horaires + fermetures exceptionnelles | `/admin` → "Horaires" |

Le bandeau "ouvert maintenant", le tableau d'horaires du pied de page, les
données structurées schema.org et l'affichage des horaires lisent tous
`content/horaires.yml` — une seule source, plus de duplication à
synchroniser à la main.

## État actuel (21 août 2026)

- ✅ Organisation GitHub `cave-belle-epoque` + dépôt `site` créés et poussés.
  **Le dépôt est public** — Netlify refuse de déployer gratuitement un dépôt
  privé appartenant à une organisation (offre payante à 20 $/mois sinon) ;
  sans secret ni identifiant dans ce dépôt, le rendre public n'expose rien.
- ✅ Équipe Netlify `la-belle-epoque` créée, projet connecté et déployé :
  **https://cave-belle-epoque.netlify.app**
- ✅ Contrôle d'accès équipe désactivé (le site était verrouillé derrière une
  connexion Netlify par défaut — corrigé, le site est public).
- ✅ Netlify Forms activé (désactivé par défaut sur un nouveau projet).
- ✅ Formulaire de réservation corrigé : la première version postait le
  formulaire sans interception JS ni page de destination, ce qui produisait
  un "Page not found" au lieu du message de confirmation. Réécrit en
  soumission AJAX (`fetch` + `preventDefault`) — testé en conditions réelles
  sur le site déployé, soumission bien reçue côté Netlify Forms.
- ✅ Relais OAuth GitHub pour Decap CMS déployé et **vérifié avec une vraie
  connexion** (pas seulement des tests synthétiques) : `/admin` → "Login
  with GitHub" → autorisation → interface Decap CMS avec les 3 collections.
  Deux pièges rencontrés en route : (1) marquer une variable d'environnement
  "secret" via l'outil de configuration utilisé ne la rendait pas visible
  pour les fonctions — recréée en variable normale, en clair côté Netlify,
  ce qui est un choix assumé pour ce projet ; (2) une variable a disparu en
  cours de manipulation (`OAUTH_GITHUB_CLIENT_ID`), recréée. Les deux
  variables sont maintenant stables : `OAUTH_GITHUB_CLIENT_ID` et
  `OAUTH_GITHUB_CLIENT_SECRET`, scopes Builds/Functions/Runtime.
- ✅ Photos sur les événements : champ image ajouté à la collection
  Decap CMS, gabarit adapté (carte avec photo pleine largeur en haut si
  présente, inchangée sinon), stockage dans `assets/uploads/` déjà
  branché. **L'événement "Réouverture · Vogue" porte une photo de
  démonstration** (`assets/uploads/demo-vogue.jpg`, en fait la photo de
  terrasse réutilisée) pour montrer la fonctionnalité — à remplacer par
  une vraie photo ou à retirer avant la présentation. Pas de
  redimensionnement automatique : éviter les photos de plus de 2-3 Mo.

## Ce qui reste à faire avant la remise au client

1. Choisir et brancher un nom de domaine définitif (le site vit pour
   l'instant sur `cave-belle-epoque.netlify.app`) ; une fois fait, passer le
   champ `image` du JSON-LD dans `_includes/base.njk` en URL absolue.
2. Vérifier les horaires réels avec Hélène et Nicolas (ceux en place
   viennent de la fiche la plus détaillée trouvée en ligne, pas confirmés).
3. Faire éditer un vrai contenu par Hélène/Nicolas eux-mêmes une première
   fois (le menu de la semaine, par exemple) pour valider l'expérience
   d'édition de bout en bout, pas seulement la connexion.
4. Le jour venu, inviter `cavelabelleepoque@outlook.fr` comme Owner sur
   l'organisation GitHub et sur l'équipe Netlify (voir architecture.md §9bis).
