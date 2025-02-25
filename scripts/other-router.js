const dbConnection = require("./router-setup");

const supabase = dbConnection.supabase;
const paintingSelect = `paintingId, artist:artistId (*), gallery:galleryId (*), imageFileName, title, shape:shapeId (*), museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, googleDescription, wikiLink, jsonAnnotations`;
const genreSelect = `genreId, genreName, era:eraId(*), description, wikiLink`;

const selectOptions = {
  paintings: paintingSelect,
  genres: genreSelect,
};
const handleError = dbConnection.handleError;

// Handles all cases where the entire table needs to be returned (minus paintings)
exports.handleEntireTable = (app, table) => {
    app.get(`/api/${table}`, async (req, res) => {
      const select = selectOptions[table] || "*";
      const { data, error } = await supabase.from(table).select(select);
      if (handleError(res, data, error, `Data not found`)) return;
      res.send(data);
    });
  };

// Handles the specific reference result for galleries and artists
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