# Maquettes — page unique, deux variantes

Deux fichiers **autonomes** (logo et photo intégrés en base64), reliés entre eux
par un lien dans le badge en bas à gauche :

- `index.html` — **Variante A « terrasse »** : claire, photo plein écran en
  ouverture, équilibre entre les trois métiers. ~500 Ko.
- `variante-caviste.html` — **Variante B « caviste »** : sombre, typographique,
  la cave en tête d'affiche. Sélection de bouteilles illustrées (SVG), bandeau
  défilant des régions, coffrets mis en avant, apparitions au défilement
  (désactivées si l'utilisateur préfère les animations réduites). ~420 Ko.

La B ajoute des contenus inventés supplémentaires : les 4 bouteilles de la
« sélection du moment » (appellations réelles, prix plausibles mais fictifs),
les prix des coffrets, et la citation d'Hélène & Nicolas — **à faire valider
ou remplacer avant toute présentation publique**.

Chaque fichier est **autonome** : logo et photo sont intégrés en base64.
Aucun dossier `assets` n'est requis pour l'afficher. Un double-clic suffit,
et le fichier peut être envoyé tel quel par mail ou AirDrop pour être ouvert
sur un téléphone en rendez-vous.

Poids : ~500 Ko.

## Ce qui est démontré

- **Événements** — agenda de 3 cartes, le prochain mis en avant.
- **Réservation du midi** — formulaire de *demande*, confirmé par téléphone
  (choix assumé : voir la note sur la charge de travail dans `../docs/brief.md`).
- **Menu de la semaine** — 4 jours + ardoise permanente.
- **Statut d'ouverture calculé en direct** en JavaScript à partir des horaires
  réels : le bandeau et le tableau des horaires se mettent à jour tout seuls
  selon le jour et l'heure de consultation.

## Contenus d'exemple

Les plats, les prix des planches et les deux derniers événements sont
**inventés** pour la démonstration — ils sont plausibles mais non validés.
Seuls sont réels : l'adresse, le téléphone, l'e-mail, les notes d'avis,
le menu Pelaud du vendredi, le prix du menu à 21 € et la réouverture du
21 août pour la vogue.

Le badge « Maquette — contenus d'exemple » en bas à gauche le signale.
Il se retire en supprimant la balise `<div class="mockup">`.

## Horaires

Ceux affichés viennent de la fiche Monts du Lyonnais Tourisme (la plus
détaillée des quatre sources trouvées, toutes contradictoires).
**À faire confirmer par les gérants avant toute mise en ligne.**
Ils sont définis à deux endroits : le tableau HTML de la section « Nous trouver »
et le tableau `h` du script en bas de page.
