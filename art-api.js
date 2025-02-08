const express = require("express");
const app = express();
require("dotenv").config();
const supa = require("@supabase/supabase-js");
const supaUrl = process.env.SUPABASE_URL;
const supaAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = supa.createClient(supaUrl, supaAnonKey);

const router = require("./scripts/art-router.js");

// router.handleEntireTable(app, "eras");
// router.handleEntireTable(app, "galleries");
// router.handleEntireTable(app, "artists");
// router.handleEntireTable(app, "paintings");
// router.handleEntireTable(app, "genres");
//base table routes
const tables = ["eras", "galleries", "artists", "paintings", "genres"];
tables.forEach((table) => {
  router.handleEntireTable(app, table);
});

// /api/galleries/30 // /api/galleries/Calgary is this meant to be for the Id check?
app.get("/api/galleries/:value", async (req, res) => {
  const table = req.params.table;
  const value = req.params.value;
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .eq("galleryId", value);
  if (error) {
    console.error("Error fetching data: ", error);
    return res.status(500).json({ error: "server error" });
  }
  if (data.length === 0) {
    console.error("No content found");
    return res.status(404).json({ message: "No data found" });
  }
  res.send(data);
});

// /api/galleries/country/fra
app.get("/api/galleries/country/:value", async (req, res) => {
  const table = req.params.table;
  const value = req.params.value;
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .ilike("galleryCountry", `%${value}%`);
  if (error) {
    console.error("Error fetching data: ", error);
    return res.status(500).json({ error: "server error" });
  }
  if (data.length === 0) {
    console.error("No content found");
    return res.status(404).json({ message: "No data found" });
  }
  res.send(data);
});

// /api/artists/12
// /api/artists/1223423
app.get("/api/artists/:value", async (req, res) => {
  const value = req.params.value;
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("artistId", value);
  if (error) {
    console.error("Error fetching data: ", error);
    return res.status(500).json({ error: "server error" });
  }
  if (data.length === 0) {
    console.error("No content found");
    return res.status(404).json({ message: "No data found" });
  }
  res.send(data);
});

// /api/artists/search/ma
// /api/artists/search/mA
app.get("/api/artists/search/:value", async (req, res) => {
  const value = req.params.value;
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .ilike("firstName", `%${value}%`);
  if (error) {
    console.error("Error fetching data: ", error);
    return res.status(500).json({ error: "server error" });
  }
  if (data.length === 0) {
    console.error("No content found");
    return res.status(404).json({ message: "No data found" });
  }
  res.send(data);
});

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
