const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const matter = require("gray-matter");
const { globSync } = require("glob");

const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MOIS_FR_COURT = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

module.exports = function (eleventyConfig) {
  // Fichiers statiques copiés tels quels
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");

  // Filtre de date minimal en français. On lit toujours en UTC : js-yaml
  // parse les dates non citées ("2026-08-21") comme minuit UTC, et le
  // format ISO "date seule" est lui aussi défini comme UTC par la norme
  // ECMAScript — lire en local exposerait à un décalage d'un jour selon
  // le fuseau horaire du serveur de build.
  eleventyConfig.addFilter("date", (value, fmt) => {
    const d = value instanceof Date ? value : new Date(value);
    const day = d.getUTCDate();
    const month = d.getUTCMonth();
    if (fmt === "d MMMM") return `${day} ${MOIS_FR[month]}`;
    if (fmt === "d") return String(day);
    if (fmt === "MMM") return MOIS_FR_COURT[month];
    return d.toISOString();
  });

  // --- content/menu.yml et content/horaires.yml : données globales ---
  eleventyConfig.addGlobalData("menu", () => {
    return yaml.load(fs.readFileSync(path.join(__dirname, "content/menu.yml"), "utf8"));
  });
  eleventyConfig.addGlobalData("horaires", () => {
    return yaml.load(fs.readFileSync(path.join(__dirname, "content/horaires.yml"), "utf8"));
  });

  // Liste à plat des créneaux ouverts, pour le schema.org JSON-LD (évite de
  // gérer les virgules entre boucles imbriquées directement en Nunjucks).
  eleventyConfig.addGlobalData("openingHours", () => {
    const data = yaml.load(fs.readFileSync(path.join(__dirname, "content/horaires.yml"), "utf8"));
    const out = [];
    for (const j of data.jours) {
      if (j.ferme) continue;
      for (const c of j.creneaux) {
        out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: j.jour, opens: c.debut, closes: c.fin });
      }
    }
    return out;
  });

  // --- content/evenements/*.md : collection triée par date ---
  // Lus directement (pas via le pipeline de templates Eleventy) pour que
  // Decap CMS puisse gérer ce dossier sans que chaque fichier devienne une
  // page à part entière.
  eleventyConfig.addCollection("evenements", () => {
    const files = globSync("content/evenements/*.md", { cwd: __dirname, absolute: true });
    return files
      .map((file) => {
        const raw = fs.readFileSync(file, "utf8");
        const { data, content } = matter(raw);
        return {
          ...data,
          body: content.trim(),
          slug: path.basename(file, ".md"),
        };
      })
      .filter((ev) => ev.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
