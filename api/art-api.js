const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();

const supaUrl = "https://ktaeyulwikklstugtztt.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0YWV5dWx3aWtrbHN0dWd0enR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5ODg1MTAsImV4cCI6MjA1NDU2NDUxMH0.1eLImK6Dmpi_69Ll6dB9MPa_D7LrF4N2MpJiz6d96BA";

const supabase = supa.createClient(supaUrl, supaAnonKey);

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
