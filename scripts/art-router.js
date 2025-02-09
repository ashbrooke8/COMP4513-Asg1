require("dotenv").config();
const supa = require("@supabase/supabase-js");
const supaUrl = process.env.SUPABASE_URL;
const supaAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = supa.createClient(supaUrl, supaAnonKey);

const paintingSelect = `paintingId, artistId (artistId, firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), galleryId (galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId), imageFileName, title, shapeId (shapeId, shapeName), museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations`;
const genreSelect = `genreId, genreName, eraId(eraId, eraName, eraYears), description, wikiLink`;

const selectOptions = {
  paintings: paintingSelect,
  genres: genreSelect,
};

const handleError = (res, data, error, message = "No data found") => {
  if (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error" });
    return true;
  }

  if (!data || data.length === 0) {
    console.error(message);
    res.status(404).json({ message });
    return true;
  }

  return false;
};

const handleEntireTable = (app, table) => {
  app.get(`/api/${table}`, async (req, res) => {
    const select = selectOptions[table] || "*";
    const { data, error } = await supabase.from(table).select(select);
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

const handleSpecificResult = (app, table, idField) => {
  app.get(`/api/${table}/:ref`, async (req, res) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq(idField, req.params.ref);
    if (
      handleError(
        res,
        data,
        error,
        `${table} with id ${req.params.ref} not found`
      )
    )
      return;
    res.send(data);
  });
};

const handleSpecificPainting = (app) => {
  app.get("/api/paintings/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .eq("paintingId", req.params.ref);
    if (
      handleError(
        res,
        data,
        error,
        `Painting with id ${req.params.ref} not found`
      )
    )
      return;
    res.send(data);
  });
};

const handleSpecificGenre = (app) => {
  app.get("/api/genres/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("genres")
      .select(genreSelect)
      .eq("genreId", req.params.ref);
    if (
      handleError(res, data, error, `Genre with id ${req.params.ref} not found`)
    )
      return;
    res.send(data);
  });
};

const handleGallerySubtring = (app) => {
  app.get("/api/galleries/country/:substring", async (req, res) => {
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .ilike("galleryCountry", `${req.params.substring}%`);
    if (
      handleError(
        res,
        data,
        error,
        `Gallery with substring ${req.params.substring} not found`
      )
    )
      return;
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
    if (
      handleError(
        res,
        data,
        error,
        `Artist with substring ${req.params.substring} not found`
      )
    )
      return;
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
      .select(paintingSelect)
      .order(column, { ascending: true });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

const handlePaintingSubstring = (app) => {
  app.get("/api/paintings/search/:substring", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .ilike("title", `%${req.params.substring}%`);
    if (
      handleError(
        res,
        data,
        error,
        `Painting with substring ${req.params.substring} not found`
      )
    )
      return;
    res.send(data);
  });
};

const handlePaintingsBetweenYears = (app) => {
  //ERROR CHECKING FOR START DATE BEING GREATER THAN END DATE NEEDS TO BE IMPLEMENTD
  app.get("/api/paintings/years/:start/:end", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .gte("yearOfWork", req.params.start)
      .lte("yearOfWork", req.params.end)
      .order("yearOfWork", { ascending: true });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

const handlePaintingsInGallery = (app) => {
  app.get("/api/paintings/galleries/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .eq("galleryId", req.params.ref);
    if (
      handleError(
        res,
        data,
        error,
        `Paintings in gallery ${req.params.ref} not found`
      )
    )
      return;
    res.send(data);
  });
};

const handlePaintingsByArtist = (app) => {
  app.get("/api/paintings/artist/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .eq("artistId", req.params.ref);
    if (
      handleError(
        res,
        data,
        error,
        `Paintings by artist ${req.params.ref} not found`
      )
    )
      return;
    res.send(data);
  });
};

const handlePaintingsByNationality = (app) => {
  app.get("/api/paintings/artist/country/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .ilike("artistId.nationality", `${req.params.ref}%`);
    if (
      handleError(
        res,
        data,
        error,
        `Paintings by artist with nationality ${req.params.ref} not found`
      )
    )
      return;
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
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

const handlePaintingsOfGenre = (app) => {
  app.get("/api/paintings/genre/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select(`paintingId (paintingId, title, yearOfWork)`)
      .eq("genreId", req.params.ref)
      .order("yearOfWork", { referencedTable: "paintingId", ascending: true });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

//RETURN ALL PAINTINGS OF A GIVEN ERA
const handlePaintingsOfEra = (app) => {
  app.get("/api/paintings/era/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select(
        `paintingId!inner (paintingId, title, yearOfWork), genreId!inner (eraId)`
      )
      .eq("genreId.eraId", req.params.ref)
      .order("yearOfWork", { referencedTable: "paintingId", ascending: true });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

//RETURN THE GENRE NAME AND NUMBER OF PAINTINGS FOR EACH GENRE

//RETURNS THE ARTIST NAME AND NUMBER OF PAINTINGS FOR EACH ARTIST

//RETURN THE GENRE NAME AND NUMBER OF PAINTINGS FOR EACH GENRE

module.exports = {
  supabase,
  handleEntireTable,
  handleSpecificResult,
  handleSpecificPainting,
  handleSpecificGenre,
  handleGallerySubtring,
  handleArtistSubstring,
  handlePaintingsSorted,
  handleGenresOfPainting,
  handlePaintingsOfGenre,
  handlePaintingSubstring,
  handlePaintingsBetweenYears,
  handlePaintingsInGallery,
  handlePaintingsByArtist,
  handlePaintingsByNationality,
  handlePaintingsOfEra,
};
