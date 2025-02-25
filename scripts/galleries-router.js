const dbConnection = require("./router-setup");

const supabase = dbConnection.supabase;

const handleError = dbConnection.handleError;

// Returns galleries where galleryCountry begins with substring
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