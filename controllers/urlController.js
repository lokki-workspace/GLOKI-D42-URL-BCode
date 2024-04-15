
import shortUrl from "../model/url.js";


// POST : http://localhost:8000/api/url
export async function urlshortener(req, res) {
  const body = req.body;
  try {
    const shortId = shortid();
    if (!body.url) return res.status(400).send({ error: "Url is required" });
    await shortUrl.create({
      shortId: shortId,
      FullUrl: body.url,
    });
    return res.status(201).send({ id: shortId });
  } catch (error) {
    res.status(500).send({ error: "Can't get the Url" });
  }
}

// GET : http://localhost:8000/api/:shortId
export async function getShortUrl(req, res) {
  const shortId = req.params.shortId;
  
  try {
    const entry = await shortUrl.findOne({ shortId });
    return res.redirect(entry.FullUrl);
  } catch (error) {
    return res.status(500).send({ error: "Can't get the ShortUrl" });
  }
}
