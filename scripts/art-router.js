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
    if (error.message.includes("invalid input syntax")) {
      return res.status(400).json({
        error: "Invalid input type.",
      });
    }
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

exports.handleAllPaintings = (app) => {
  app.get(`/api/paintings`, async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .order("title", { ascending: true });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

exports.handleEntireTable = (app, table) => {
  app.get(`/api/${table}`, async (req, res) => {
    const select = selectOptions[table] || "*";
    const { data, error } = await supabase.from(table).select(select);
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

exports.handleSpecificResult = (app, table, idField) => {
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
        `Result from ${table} with id ${req.params.ref} not found`
      )
    )
      return;
    res.send(data);
  });
};

exports.handleSpecificPainting = (app) => {
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

exports.handleSpecificGenre = (app) => {
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

exports.handleGallerySubtring = (app) => {
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

exports.handleArtistSubstring = (app) => {
  app.get("/api/artists/:field/:substring", async (req, res) => {
    let column = "";
    if (req.params.field === "search") {
      column = "lastName";
    } else if (req.params.field === "country") {
      column = "nationality";
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

exports.handlePaintingsSorted = (app) => {
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

exports.handlePaintingSubstring = (app) => {
  app.get("/api/paintings/search/:substring", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .ilike("title", `%${req.params.substring}%`)
      .order("title", { ascending: true });
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

exports.handlePaintingsBetweenYears = (app) => {
  app.get("/api/paintings/years/:start/:end", async (req, res) => {
    const start = parseInt(req.params.start);
    const end = parseInt(req.params.end);
    if (start > end) {
      //error handling to check that end is bigger than start
      return res
        .status(400)
        .json({ error: "Starting year must be smaller than end year." });
    }
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .gte("yearOfWork", start)
      .lte("yearOfWork", end)
      .order("yearOfWork", { ascending: true });
    if (handleError(res, data, error, `Data not found`)) return;
    if (req.params.start > req.params.end) {
      //doesn't work
      return res.status(400).json({
        error: "Year start must be less than year end",
      });
    }
    res.send(data);
  });
};

exports.handlePaintingsInGallery = (app) => {
  app.get("/api/paintings/galleries/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .eq("galleryId", req.params.ref)
      .order("title", { ascending: true });
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

exports.handlePaintingsByArtist = (app) => {
  app.get("/api/paintings/artist/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .eq("artistId", req.params.ref)
      .order("title", { ascending: true });
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

exports.handlePaintingsByNationality = (app) => {
  app.get("/api/paintings/artist/country/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select(paintingSelect)
      .ilike("artistId.nationality", `${req.params.ref}%`)
      .order("title", { ascending: true });
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

exports.handleGenresOfPainting = (app) => {
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

exports.handlePaintingsOfGenre = (app) => {
  app.get("/api/paintings/genre/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select(`paintings:paintings (paintingId, title, yearOfWork)`)
      .eq("genreId", req.params.ref)
      .order("paintings(yearOfWork)", {
        ascending: true,
      });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

//RETURN ALL PAINTINGS OF A GIVEN ERA
exports.handlePaintingsOfEra = (app) => {
  app.get("/api/paintings/era/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select(
        `paintings:paintings (paintingId, title, yearOfWork), genreId!inner (eraId)`
      )
      .eq("genreId.eraId", req.params.ref)
      .order("paintings(yearOfWork)", {
        ascending: true,
      });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

//RETURN THE GENRE NAME AND NUMBER OF PAINTINGS FOR EACH GENRE
exports.handleGenreCount = (app) => {
  app.get("/api/counts/genres", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select("genre:genreId!inner(genreName), paintingId", { count: "exact" });

    if (handleError(res, data, error, "Data not found")) return;

    const genreCounts = {};
    data.forEach((item) => {
      const genreName = item.genre.genreName;
      genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
    });

    const result = Object.keys(genreCounts) //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
      .map((genre) => ({ genre, count: genreCounts[genre] }))
      .sort((a, b) => a.count - b.count); //sort ascending

    res.send(result);
  });
};

//RETURNS THE ARTIST NAME AND NUMBER OF PAINTINGS FOR EACH ARTIST
exports.handleArtistCount = (app) => {
  app.get("/api/counts/artists", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select("artist:artistId!inner(firstName, lastName), paintingId", {
        count: "exact",
      });

    if (handleError(res, data, error, "Data not found")) return;

    const artistCounts = {};
    data.forEach((item) => {
      const artistName = `${item.artist.firstName} ${item.artist.lastName}`;
      artistCounts[artistName] = (artistCounts[artistName] || 0) + 1;
    });

    const result = Object.keys(artistCounts)
      .map((artist) => ({ artist, count: artistCounts[artist] }))
      .sort((a, b) => b.count - a.count); //sort descending

    res.send(result);
  });
};

//RETURN THE GENRE NAME AND NUMBER OF PAINTINGS FOR EACH GENRE
exports.handleTopGenreCount = (app) => {
  app.get("/api/counts/topgenres/:min", async (req, res) => {
    if (isNaN(req.params.min)) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const { data, error } = await supabase
      .from("paintinggenres")
      .select("genre:genreId!inner(genreName), paintingId", { count: "exact" });
    if (handleError(res, data, error, "Data not found")) return;

    const genreCounts = {};
    data.forEach((item) => {
      const genreName = item.genre.genreName;
      genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
    });

    const result = Object.keys(genreCounts)
      .map((genre) => ({ genre, count: genreCounts[genre] }))
      .filter((item) => item.count > req.params.min)
      .sort((a, b) => b.count - a.count); //sort ascending

    if (result.length === 0) {
      return res.status(404).json({
        error: `There are not ${req.params.min} entries in any genre, please use a smaller number`,
      });
    }
    res.send(result);
  });
};
