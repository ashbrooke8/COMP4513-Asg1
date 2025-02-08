require("dotenv").config();
const supa = require("@supabase/supabase-js");

const supaUrl = process.env.SUPABASE_URL;
const supaAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = supa.createClient(supaUrl, supaAnonKey);

const handleEntireTable = (app, table) => {
  app.get(`/api/${table}`, async (req, res) => {
    const { data, error } = await supabase.from(table).select("*");
    const handleEntireTable = (app, table) => {
      app.get(`/api/${table}`, async (req, res) => {
        const { data, error } = await supabase.from(table).select("*");
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
    };
    res.send(data);
  });
};

module.exports = { handleEntireTable };
