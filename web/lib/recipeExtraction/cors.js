export function applyCors(req, res) {
  const corsOrigin =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3333"
      : process.env.SANITY_STUDIO_URL || "https://www.sanity.io";

  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}
