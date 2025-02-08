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

router.handleAllPaintings(app);
router.handleAllGenres(app);
router.handleSpecificResult(app, "galleries", "galleryId");
router.handleSpecificResult(app, "artists", "artistId");
router.handleSpecificPainting(app);
router.handleSpecificResult(app, "genres", "genreId");

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
