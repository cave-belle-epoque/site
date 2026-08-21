// Deuxième étape du relais OAuth : GitHub revient ici après que la personne
// a cliqué "Authorize" (voir l'URL de callback réglée dans l'application
// OAuth GitHub). On échange le code temporaire contre un vrai jeton d'accès,
// puis on le transmet à la fenêtre Decap CMS d'origine via postMessage —
// c'est le protocole attendu par le backend "github" de Decap CMS, pas une
// invention de notre part.
exports.handler = async (event) => {
  const code = event.queryStringParameters && event.queryStringParameters.code;

  if (!code) {
    return { statusCode: 400, body: "Code d'autorisation manquant." };
  }

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const missing = [
      !clientId ? "OAUTH_GITHUB_CLIENT_ID" : null,
      !clientSecret ? "OAUTH_GITHUB_CLIENT_SECRET" : null,
    ].filter(Boolean);
    return {
      statusCode: 500,
      body: `Variable(s) d'environnement manquante(s) sur Netlify : ${missing.join(", ")}.`,
    };
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return {
      statusCode: 401,
      body: `Échec de l'authentification GitHub : ${tokenData.error_description || tokenData.error}`,
    };
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: "github" });

  // Page volontairement minimale : elle ne fait que relayer le jeton à la
  // fenêtre qui l'a ouverte (Decap CMS), puis se referme d'elle-même.
  const body = `<!doctype html><html><body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:success:${payload}',
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body></html>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body,
  };
};
// redeploy: prise en compte du client secret (2026-08-21T10:07:43Z)
// redeploy: OAUTH_GITHUB_CLIENT_SECRET corrigé (2026-08-21T10:14:38Z)
