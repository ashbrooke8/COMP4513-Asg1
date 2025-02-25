const dbConnection = require("./router-setup");

const supabase = dbConnection.supabase;
const handleError = dbConnection.handleError;

const paintingSelect = `paintingId, artist:artistId (*), gallery:galleryId (*), imageFileName, title, shape:shapeId (*), museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations`;

// Returns all the paintings with all the fields
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

// Returns a specific painting with all the fields
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

// Returns all of the paintings, sorted either by title or year depending on what is specified
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
  
// Returns the paintings based on the specified title
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
  
// Returns the paintings between two years (inclusive)
exports.handlePaintingsBetweenYears = (app) => {
  app.get("/api/paintings/years/:start/:end", async (req, res) => {
    const start = req.params.start;
    const end = req.params.end;
    //check that both start and end are positive ints
    const regex = /^[1-9]\d*$/;
    if (!regex.test(start) || !regex.test(end)) {
      return res
        .status(400)
        .json({ error: "Start and end years must be a positive integer." });
    }
    if (start > end) {
      //error handling to check that end is bigger than start
      return res.status(400).json({
        error: "Starting year must be smaller than or equal to end year.",
      });
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
  
// Returns all the paintings in a gallery
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
  
// Handles paintings by a given artist
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
  
// Handle paintings by artists of a specified nationality
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

// Returns all of the paintings of a genre
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

// Return all paintings of a given era
exports.handlePaintingsOfEra = (app) => {
  app.get("/api/paintings/era/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select(
        `painting:paintings (paintingId, title, yearOfWork), era:genreId!inner (eraId)`
      )
      .eq("genreId.eraId", req.params.ref)
      .order("painting(yearOfWork)", {
        ascending: true,
      });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};