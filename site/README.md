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

## Ce qui reste à faire avant mise en ligne

1. Créer l'organisation GitHub `cave-belle-epoque` + y pousser ce dépôt
   (voir `../docs/architecture.md` §9bis pour le pourquoi).
2. Déployer le petit relais OAuth GitHub pour Decap CMS, puis décommenter
   `base_url`/`auth_endpoint` dans `admin/config.yml`.
3. Mettre à jour `repo:` dans `admin/config.yml` avec le vrai nom du dépôt.
4. Connecter le dépôt à Netlify (régler "Base directory" = `site` si ce
   dépôt garde aussi `docs/` et `maquette/` à la racine).
5. Une fois le nom de domaine choisi, passer le champ `image` du JSON-LD
   dans `_includes/base.njk` en URL absolue.
6. Vérifier les horaires réels avec Hélène et Nicolas (ceux en place
   viennent de la fiche la plus détaillée trouvée en ligne, pas confirmés).
