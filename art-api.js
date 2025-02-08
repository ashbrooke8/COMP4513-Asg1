const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();

const supaUrl = "https://ktaeyulwikklstugtztt.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0YWV5dWx3aWtrbHN0dWd0enR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5ODg1MTAsImV4cCI6MjA1NDU2NDUxMH0.1eLImK6Dmpi_69Ll6dB9MPa_D7LrF4N2MpJiz6d96BA";

const supabase = supa.createClient(supaUrl, supaAnonKey);

const router = require("./scripts/art-router.js");
router.handleEntireTable(app, "eras");
router.handleEntireTable(app, "galleries");
router.handleEntireTable(app, "artists");
router.handleEntireTable(app, "paintings");
router.handleEntireTable(app, "genres");

// /api/galleries/30
// /api/galleries/Calgary
// /api/galleries/country/fra
// /api/artists/12
// /api/artists/1223423
// /api/artists/search/ma
// /api/artists/search/mA
// /api/artists/country/fra
// /api/paintings/sort/year
// /api/paintings/63
// /api/paintings/search/port
// /api/paintings/search/pORt
// /api/paintings/search/connolly
// /api/paintings/1800/1850
// /api/paintings/galleries/5
// /api/paintings/artist/16
// /api/paintings/artist/666
// /api/paintings/artist/country/ital
// /api/genres/76
// /api/genres/painting/408
// /api/genres/painting/jsdfhg
// /api/paintings/genre/78
// /api/paintings/era/2
// /api/counts/genres
// /api/counts/artists
// /api/counts/topgenres/20
// /api/counts/topgenres/2034958

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
