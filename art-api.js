const express = require("express");
const app = express();
require("dotenv").config();
// const supa = require("@supabase/supabase-js");
// const supaUrl = process.env.SUPABASE_URL;
// const supaAnonKey = process.env.SUPABASE_ANON_KEY;
// const supabase = supa.createClient(supaUrl, supaAnonKey);

const router = require("./scripts/art-router.js");

//base table routes to return all fields in table
const tables = ["eras", "galleries", "artists"];
tables.forEach((table) => {
  router.handleEntireTable(app, table);
});

//create routes with no args
const simpleRoutes = [
  "handleAllPaintings",
  "handleAllGenres",
  "handleSpecificPainting",
  "handleGallerySubstring",
  "handleArtistSubstring",
  "handleSpecificGenre",
  "handlePaintingsSorted",
  "handleGenresOfPainting",
  "handlePaintingsOfGenre",
  "handlePaintingSubstring",
  "handlePaintingsBetweenYears",
  "handlePaintingsInGallery",
  "handlePaintingsByArtist",
  "handlePaintingsByNationality",
  "handlePaintingsOfEra",
  "handleGallerySubtring",
];
simpleRoutes.forEach((method) => {
  if (typeof router[method] === "function") {
    router[method](app);
  }
});

//routes with args
router.handleSpecificResult(app, "galleries", "galleryId");
router.handleSpecificResult(app, "artists", "artistId");

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
