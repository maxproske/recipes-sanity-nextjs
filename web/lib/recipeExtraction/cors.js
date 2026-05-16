// Allow the Studio in all the places it's served from:
//  - local dev (sanity dev)
//  - the deployed *.sanity.studio bundle
//  - www.sanity.io (when the Studio is loaded under the org's Apps URL)
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (origin === "http://localhost:3333") return true;
  if (origin === "https://www.sanity.io") return true;
  if (/^https:\/\/[a-z0-9-]+\.sanity\.studio$/i.test(origin)) return true;
  return false;
}

export function applyCors(req, res) {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}
