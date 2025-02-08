const supa = require("@supabase/supabase-js");

const supaUrl = "https://ktaeyulwikklstugtztt.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0YWV5dWx3aWtrbHN0dWd0enR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5ODg1MTAsImV4cCI6MjA1NDU2NDUxMH0.1eLImK6Dmpi_69Ll6dB9MPa_D7LrF4N2MpJiz6d96BA";

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
