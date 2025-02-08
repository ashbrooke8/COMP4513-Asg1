require("dotenv").config();
const supa = require("@supabase/supabase-js");
const supaUrl = process.env.SUPABASE_URL;
const supaAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = supa.createClient(supaUrl, supaAnonKey);

const handleError = (data, error) => {
  if (error) {
    console.error("Error fetching data: ", error);
    return res.status(500).json({ error: "server error" });
  }
  if (data.length === 0) {
    console.error("No content found");
    return res.status(404).json({ message: "No data found" });
  }
};

const handleEntireTable = (app, table) => {
  app.get(`/api/${table}`, async (req, res) => {
    const { data, error } = await supabase.from(table).select("*");
    handleError(data, error);
    res.send(data);
  });
};

const handleAllPaintings = (app) => {
  app.get("/api/paintings", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(
        `paintingId, artistId (artistId, firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), galleryId (galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId), imageFileName, title, shapeId (shapeName), museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations`
      )
      .order("title", { ascending: true });
    handleError(data, error);
    res.send(data);
  });
};

const handleAllGenres = (app) => {
  app.get("/api/genres", async (req, res) => {
    const { data, error } = await supabase
      .from("genres")
      .select(
        `genreId, genreName, eraId(eraId, eraName, eraYears), description, wikiLink`
      );
    handleError(data, error);
    res.send(data);
  });
};

const handleSpecificResult = (app, table, idField) => {
  app.get(`/api/${table}/:ref`, async (req, res) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq(idField, req.params.ref);
    handleError(data, error);
    res.send(data);
  });
};

const handleSpecificPainting = (app) => {
  app.get("/api/paintings/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(
        `paintingId, artistId (firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), galleryId (galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId), imageFileName, title, shapeId (shapeName), museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations`
      )
      .eq("paintingId", req.params.ref);
    handleError(data, error);
    res.send(data);
  });
};

const handleSpecificGenre = (app) => {
  app.get("/api/genres/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("genres")
      .select(
        `genreId, genreName, eraId(eraId, eraName, eraYears), description, wikiLink`
      )
      .eq("genreId", req.params.ref);
    handleError(data, error);
    res.send(data);
  });
};

module.exports = {
  supabase,
  handleEntireTable,
  handleAllPaintings,
  handleAllGenres,
  handleSpecificResult,
  handleSpecificPainting,
  handleSpecificGenre,
};
