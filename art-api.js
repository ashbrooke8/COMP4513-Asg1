const express = require("express");
const app = express();
require("dotenv").config();

//gather all route methods
const artistsRoutes = require("./scripts/artists-router.js");
const galleriesRoutes = require("./scripts/galleries-router.js");
const genresRoutes = require("./scripts/genres-router.js");
const otherRoutes = require("./scripts/other-router.js");
const paintingsRoutes = require("./scripts/paintings-router.js");

// all route creation
paintingsRoutes.handleAllPaintings(app);

artistsRoutes.handleArtistSubstring(app);
artistsRoutes.handleArtistCount(app);

galleriesRoutes.handleGallerySubtring(app);

genresRoutes.handleSpecificGenre(app);
genresRoutes.handleGenresOfPainting(app);
genresRoutes.handleGenreCount(app);
genresRoutes.handleTopGenreCount(app);

const tables = ["eras", "galleries", "artists", "genres"];
tables.forEach((table) => {
  otherRoutes.handleEntireTable(app, table);
});
otherRoutes.handleSpecificResult(app, "galleries", "galleryId");
otherRoutes.handleSpecificResult(app, "artists", "artistId");

paintingsRoutes.handleSpecificPainting(app);
paintingsRoutes.handlePaintingsSorted(app);
paintingsRoutes.handlePaintingSubstring(app);
paintingsRoutes.handlePaintingsBetweenYears(app);
paintingsRoutes.handlePaintingsInGallery(app);
paintingsRoutes.handlePaintingsByArtist(app);
paintingsRoutes.handlePaintingsByNationality(app);
paintingsRoutes.handlePaintingsOfGenre(app);
paintingsRoutes.handlePaintingsOfEra(app);
paintingsRoutes.handlePaintingsOfGenre(app);
paintingsRoutes.handlePaintingsOfEra(app);

//if no route is found
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found! Please recheck." });
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
