const dbConnection = require("./router-setup");

const supabase = dbConnection.supabase;
const genreSelect = `genreId, genreName, era:eraId(*), description, wikiLink`;
const handleError = dbConnection.handleError;
const countItems = dbConnection.countItems;

// Returns specified genre
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

// Returns the genres used in a given painting
exports.handleGenresOfPainting = (app) => {
  app.get("/api/genres/painting/:ref", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select(
        `genre:genreId (genreId, genreName, era:eraId (eraId, eraName, eraYears), description, wikiLink)`
      )
      .eq("paintingId", req.params.ref)
      .order(`genre (genreName)`, { ascending: true });
    if (handleError(res, data, error, `Data not found`)) return;
    res.send(data);
  });
};

// Returns genre name and number of paintings for each genre
exports.handleGenreCount = (app) => {
  app.get("/api/counts/genres", async (req, res) => {
    const { data, error } = await supabase
      .from("paintinggenres")
      .select("genre:genreId!inner(genreName), paintingId", { count: "exact" });

    if (handleError(res, data, error, "Data not found")) return;

    const result = countItems(data, (item) => item.genre.genreName, "genre").sort((a,b) => a.count - b.count);

    res.send(result);
  });
};

// Returns genre and count for each genre, only for genres having over x number of paintings
exports.handleTopGenreCount = (app) => {
  app.get("/api/counts/topgenres/:min", async (req, res) => {
    if (isNaN(req.params.min)) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const { data, error } = await supabase
      .from("paintinggenres")
      .select("genre:genreId!inner(genreName), paintingId", { count: "exact" });
    if (handleError(res, data, error, "Data not found")) return;

    const result = countItems(data, (item) => item.genre.genreName, "genre").filter((item) => item.count > req.params.min).sort((a,b) => b.count - a.count);

    if (result.length === 0) {
      return res.status(404).json({
        error: `There are not ${req.params.min} entries in any genre, please use a smaller number`,
      });
    }
    res.send(result);
  });
};