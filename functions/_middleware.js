export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Only redirect root path
  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    return next();
  }

  // Safe data reading (default to US if error)
  const cf = request.cf || {};
  const country = cf.country || "US"; 
  const region = cf.regionCode || "";

  let targetPath = "/en/"; // DEFAULT FALLBACK

  try {
    if (country === "TR") {
      targetPath = "/tr/";
    } else if (country === "NL") {
      targetPath = "/nl/";
    } else if (country === "CA") {
      // Quebec gets French, others get English
      if (region === "QC") {
        targetPath = "/fr/";
      } else {
        targetPath = "/en/";
      }
    } else if (country === "FR" || country === "BE") {
      targetPath = "/fr/";
    }
  } catch (err) {
    // On any error, go to English
    targetPath = "/en/";
  }

  // 307 Redirect (temporary, don't cache)
  return Response.redirect(url.origin + targetPath, 307);
}
