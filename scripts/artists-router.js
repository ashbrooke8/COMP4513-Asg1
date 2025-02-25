const dbConnection = require("./router-setup");

const supabase = dbConnection.supabase;
const handleError = dbConnection.handleError;
const countItems = dbConnection.countItems;

// Checks the field, and depending on it being search/country, returns the results of the respective substring
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

// Returns the artist and their number of paintings, sorted most to fewest
exports.handleArtistCount = (app) => {
  app.get("/api/counts/artists", async (req, res) => {
    const { data, error } = await supabase
      .from("paintings")
      .select("artist:artistId!inner(firstName, lastName), paintingId", {
        count: "exact",
      });

    if (handleError(res, data, error, "Data not found")) return;

    const result = countItems(data, (item) => `${item.artist.firstName} ${item.artist.lastName}`, "artist").sort((a,b) => b.count - a.count);

    res.send(result);
  });
};