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
| `content/evenements/*.md` | Agenda (un fichier par événement) | `/admin` → "Événements" |
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

## Ce qui reste à faire avant la remise au client

1. Déployer le petit relais OAuth GitHub pour Decap CMS, puis décommenter
   `base_url`/`auth_endpoint` dans `admin/config.yml` (voir
   `../docs/architecture.md` §4). Sans ça, `/admin` affiche bien le bouton
   de connexion mais la connexion elle-même échouera.
2. Choisir et brancher un nom de domaine définitif (le site vit pour
   l'instant sur `cave-belle-epoque.netlify.app`) ; une fois fait, passer le
   champ `image` du JSON-LD dans `_includes/base.njk` en URL absolue.
3. Vérifier les horaires réels avec Hélène et Nicolas (ceux en place
   viennent de la fiche la plus détaillée trouvée en ligne, pas confirmés).
4. Le jour venu, inviter `cavelabelleepoque@outlook.fr` comme Owner sur
   l'organisation GitHub et sur l'équipe Netlify (voir architecture.md §9bis).
