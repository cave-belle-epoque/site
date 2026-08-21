// Première étape du relais OAuth Decap CMS ↔ GitHub.
//
// Decap CMS ouvre cette page dans une popup (voir admin/config.yml,
// base_url + auth_endpoint). On redirige simplement vers l'écran
// d'autorisation de GitHub, avec l'identifiant de l'application OAuth
// (voir docs/architecture.md §4 pour le contexte complet).
exports.handler = async () => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  if (!clientId) {
    return {
      statusCode: 500,
      body: "Variable d'environnement OAUTH_GITHUB_CLIENT_ID manquante sur Netlify.",
    };
  }

  const params = new URLSearchParams({
    client_id: clientId,
    // "public_repo" suffit puisque le dépôt est public — plus restreint
    // que "repo" (qui donnerait accès à tous les dépôts privés du compte).
    scope: "public_repo,user",
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
    },
  };
};
