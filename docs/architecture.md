# Architecture technique — site réel (post-maquette)

Objectif : passer des deux maquettes statiques à un site que **Hélène et
Nicolas peuvent mettre à jour eux-mêmes**, sans jamais toucher au code, pour
deux contenus qui changent chaque semaine (menu) et ponctuellement
(événements, horaires exceptionnels).

Contrainte qui gouverne tout le reste : **0 salarié, 2 gérants, ouverts 6j/7.**
Chaque brique doit pouvoir s'oublier une fois en place — pas d'abonnement à
surveiller, pas d'interface à apprendre au-delà d'un formulaire.

---

## 1. Vue d'ensemble

```
GitHub (dépôt privé)
   │  push
   ▼
Netlify (build + hébergement + formulaires)
   │
   ├─ site public (HTML généré par Eleventy)
   └─ /admin → Decap CMS (formulaires d'édition)
        │  commit
        ▼
   contenu versionné dans le dépôt (Markdown/YAML)
```

Aucune base de données. Le contenu (menu, événements, horaires) vit dans des
fichiers texte du dépôt Git ; chaque modification via `/admin` est un commit ;
Netlify redéploie automatiquement le site en ~1 minute.

## 2. Générateur de site : Eleventy (11ty)

Choisi plutôt qu'Astro ou Hugo pour une raison concrète : **les deux
maquettes sont déjà du HTML/CSS/JS vanille**. Eleventy consomme des templates
Nunjucks très proches du HTML actuel — on découpe `index.html` /
`variante-caviste.html` en layout + partials sans réécriture profonde. Zéro
framework JS côté client à maintenir, build en une fraction de seconde,
écosystème Decap CMS bien documenté pour ce couple précis.

Structure de dépôt proposée :

```
site/
├── _includes/
│   ├── base.njk            # <head>, header, footer communs
│   ├── hero.njk
│   ├── menu-semaine.njk     # lit content/menu.yml
│   ├── evenements.njk       # lit content/evenements/*.md
│   ├── reservation.njk      # formulaire Netlify Forms
│   └── infos.njk            # lit content/horaires.yml
├── content/
│   ├── menu.yml             # singleton, édité chaque lundi
│   ├── horaires.yml         # singleton, rarement modifié
│   ├── fermetures.yml       # liste des fermetures exceptionnelles
│   └── evenements/
│       ├── 2026-08-21-reouverture-vogue.md
│       └── 2026-09-12-concert-jazz.md
├── assets/
│   ├── logo-belle-epoque.jpg
│   ├── logo-dark.png
│   └── terrasse.jpg
├── admin/
│   ├── index.html           # point d'entrée Decap CMS
│   └── config.yml           # définition des collections
├── index.njk                 # page unique, assemble les partials
├── .eleventy.js
└── netlify.toml
```

## 3. Decap CMS — modèle de contenu

Trois collections couvrent l'intégralité du besoin exprimé :

**a) Menu de la semaine** (fichier singleton, pas une liste)
```yaml
label: "Menu de la semaine"
name: "menu"
file: "content/menu.yml"
fields:
  - {label: "Semaine du", name: "debut", widget: "date"}
  - {label: "Prix du menu", name: "prix", widget: "number", default: 21}
  - label: "Jours"
    name: "jours"
    widget: "list"
    fields:
      - {label: "Jour", name: "jour", widget: "select", options: [Mardi, Mercredi, Jeudi, Vendredi]}
      - {label: "Plat", name: "plat", widget: "string"}
      - {label: "Dessert", name: "dessert", widget: "string"}
      - {label: "Mis en avant (ex. menu Pelaud)", name: "avant", widget: "boolean", default: false}
```
→ Hélène ouvre `/admin`, clique "Menu de la semaine", remplit 4 lignes,
"Publier". Le site est à jour en une minute.

**b) Événements** (collection, un fichier par événement)
```yaml
label: "Événements"
name: "evenements"
folder: "content/evenements"
create: true
slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
fields:
  - {label: "Titre", name: "title", widget: "string"}
  - {label: "Date", name: "date", widget: "date"}
  - {label: "Horaire", name: "horaire", widget: "string"}
  - {label: "Description", name: "body", widget: "text"}
  - {label: "Mettre en avant (prochain événement)", name: "avant", widget: "boolean", default: false}
```
Le site trie automatiquement par date et affiche l'événement le plus proche
en surbrillance — exactement le comportement déjà démontré sur les deux
maquettes.

**c) Horaires & fermetures exceptionnelles**
```yaml
label: "Horaires"
name: "horaires"
file: "content/horaires.yml"
fields:
  - label: "Jours"
    name: "jours"
    widget: "list"
    fields:
      - {label: "Jour", name: "jour", widget: "string"}
      - {label: "Créneaux", name: "creneaux", widget: "string"}
      - {label: "Fermé", name: "ferme", widget: "boolean", default: false}
  - label: "Fermetures exceptionnelles"
    name: "fermetures"
    widget: "list"
    fields:
      - {label: "Motif", name: "motif", widget: "string"}
      - {label: "Du", name: "debut", widget: "date"}
      - {label: "Au", name: "fin", widget: "date"}
```
J'ai remarqué en analysant **Bleu Charrette** (même village) qu'ils
maintiennent une liste de fermetures exceptionnelles bien visible sur leur
site — bonne pratique à reprendre : ça évite l'appel "c'est fermé aujourd'hui
pourquoi ?" et ça se relie directement au problème d'horaires contradictoires
identifié au tout début de l'analyse.

Le bandeau de statut "ouvert maintenant" déjà codé dans les deux maquettes
lira ces mêmes fichiers plutôt qu'un tableau en dur — une seule source de
vérité, republiée automatiquement sur Google si on la recopie ensuite dans
leur fiche Google Business Profile.

## 4. Authentification Decap CMS

Point technique à trancher tôt car ça détermine l'expérience de connexion.

Netlify Identity + Git Gateway (l'ancienne méthode "en un clic") est
**déconseillée pour les nouveaux sites** — Netlify a arrêté d'investir dessus.
L'approche recommandée aujourd'hui : **connexion via compte GitHub**, avec un
petit serveur relais OAuth (une fonction Netlify de quelques lignes,
déployée une fois, invisible ensuite).

Côté gérants, ça reste un simple bouton **"Se connecter avec GitHub"** sur
`/admin` — je crée un compte GitHub dédié à la cave (pas de notion de code à
comprendre), et je configure le relais OAuth une fois pour toutes. Ils ne
voient jamais GitHub lui-même.

## 5. Formulaire de réservation

Pas de backend à écrire : **Netlify Forms**, natif, gratuit jusqu'à 100
soumissions/mois (largement suffisant). Chaque demande de réservation arrive
par e-mail à `cavelabelleepoque@outlook.fr` — cohérent avec le choix déjà
posé dans les maquettes ("demande, pas confirmation automatique ; on
rappelle"). Un champ honeypot invisible filtre le spam, comme le fait déjà
le site de Bleu Charrette avec son plugin dédié.

## 6. Workflow éditorial

Decap CMS propose un mode **"Editorial Workflow"** : chaque modification
passe par Brouillon → Relecture → Prêt à publier, avec un lien de prévisualisation
avant que ça parte en ligne. Je recommande de l'activer — ça rassure des
gérants qui n'ont pas l'habitude de publier eux-mêmes : rien ne part en ligne
tant qu'ils n'ont pas cliqué "publier" en connaissance de cause.

## 7. Hébergement & nom de domaine

**Netlify** pour l'hébergement (déploiement automatique à chaque commit,
formulaires inclus, HTTPS gratuit) — c'est l'option qui colle le mieux au
couple Eleventy + Decap CMS + Netlify Forms, sans frais fixes à ce niveau de
trafic.

Le nom de domaine peut rester déposé **au nom de la cave elle-même**
(pas au mien, ni à celui d'une agence) — j'ai vérifié en analysant
Bleu Charrette que c'est exactement ce qu'ils ont fait (domaine déposé
directement par la gérante). Bonne pratique à suivre : ça leur garantit la
pleine propriété du nom de domaine, quoi qu'il arrive à la relation
commerciale.

## 8. Données structurées (SEO local)

Puisque l'un des problèmes identifiés dès le départ est l'incohérence des
horaires sur le web, chaque page embarquera un bloc **schema.org
`LocalBusiness`/`WineBar`** avec adresse, téléphone et horaires — repris des
mêmes fichiers `content/horaires.yml`. Ça aide Google à afficher des
informations correctes s'ils reprennent un jour la main sur leur fiche
Google Business Profile (rappel : cette fiche semble ne pas être revendiquée
à ce jour — reste la priorité n°1, indépendante du site).

## 9. Ce qui ne change pas par rapport aux maquettes

- Design, palette, structure de page : identiques (variante A ou B, à
  trancher avec eux).
- Statut d'ouverture calculé en direct, réservation en mode demande,
  agenda trié par date : même logique, alimentée par du contenu au lieu
  de données en dur.

## 9bis. Propriété du dépôt et de l'hébergement

Décision : ni compte personnel de Thomas, ni compte à faire créer par les
gérants avant le démarrage. **Organisation GitHub dédiée** (ex.
`cave-belle-epoque`) + **équipe Netlify** correspondante, créées par Thomas,
qui y développe normalement avec les droits d'administrateur. Le jour venu
(pas d'urgence, peut se faire après la mise en ligne), l'adresse
`cavelabelleepoque@outlook.fr` est invitée avec le rôle **Owner** sur les
deux — acceptation en un clic, aucune interruption, aucun "transfert"
GitHub à proprement parler. Coût nul (paliers gratuits GitHub/Netlify
suffisants à cette échelle).

Raison : cohérence avec le nom de domaine (déjà décidé au nom de la cave,
même logique que Bleu Charrette) — la cave reste propriétaire de son
infrastructure quoi qu'il arrive à la relation commerciale, sans étape de
transfert manuelle à risque en fin de projet.

## 10. Prochaines étapes

1. Trancher variante A / B (ou hybride) avec les gérants.
2. Créer le dépôt GitHub + compte Netlify + compte GitHub dédié à la cave.
3. Scaffolder le projet Eleventy à partir de la maquette choisie.
4. Configurer Decap CMS (`admin/config.yml`) et le relais OAuth.
5. Recette avec Hélène et Nicolas sur un vrai cas : modifier le menu de la
   semaine devant eux, en moins de deux minutes.
