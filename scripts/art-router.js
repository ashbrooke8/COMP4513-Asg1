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

const handleGallerySubtring = (app) => {
  app.get("/api/galleries/country/:substring", async (req, res) => {
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .ilike("galleryCountry", `${req.params.substring}%`);
    handleError(data, error);
    res.send(data);
  });
};

const handleArtistSubstring = (app) => {
  app.get("/api/artists/:field/:substring", async (req, res) => {
    let column = "";
    if (req.params.field === "search") {
      column = "lastName";
    } else if (req.params.field === "country") {
      column === "nationality";
    }
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .ilike(column, `${req.params.substring}%`);
    handleError(data, error);
    res.send(data);
  });
};

const handlePaintingsSorted = (app) => {
  app.get("/api/paintings/sort/:sortField", async (req, res) => {
    let column = "";
    if (req.params.sortField === "title") {
      column = "title";
    } else if (req.params.sortField === "year") {
      column = "yearOfWork";
    }
    const { data, error } = await supabase
      .from("paintings")
      .select(
        `paintingId, artistId (firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), galleryId (galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId), imageFileName, title, shapeId (shapeName), museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations`
      )
      .order(column, { ascending: true });
    handleError(data, error);
    res.send(data);
  });
};

const handlePaintingSubstring = (app) => {
  app.get("/api/paintings/search/:substring", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(
        `paintingId, artistId (firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), galleryId (galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId), imageFileName, title, shapeId (shapeName), museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations`
      )
      .ilike("title", `%${req.params.substring}%`);
    handleError(data, error);
    res.send(data);
  });
};

const handleGenresOfPainting = (app) => {
  app.get("/api/genres/painting/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select(`genreId (genreId, genreName, eraId, description, wikiLink)`)
      .eq("paintingId", req.params.ref)
      .order(`genreId (genreName)`, { ascending: true });
    handleError(data, error);
    res.send(data);
  });
};

const handlePaintingsOfGenre = (app) => {
  app.get("/api/paintings/genre/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select(`paintingId (paintingId, title, yearOfWork)`)
      .eq("genreId", req.params.ref)
      .order(`paintingId (yearOfWork)`);
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
  handleGallerySubtring,
  handleArtistSubstring,
  handlePaintingsSorted,
  handleGenresOfPainting,
  handlePaintingsOfGenre,
  handlePaintingSubstring,
};
