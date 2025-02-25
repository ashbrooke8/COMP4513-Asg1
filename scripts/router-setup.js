require("dotenv").config();
const supa = require("@supabase/supabase-js");
const supaUrl = process.env.SUPABASE_URL;
const supaAnonKey = process.env.SUPABASE_ANON_KEY;
exports.supabase = supa.createClient(supaUrl, supaAnonKey);

// Error handling, called in every route
exports.handleError = (res, data, error, message = "No data found") => {
  if (error) {
    console.error("Error fetching data:", error);
    if (error.message.includes("invalid input syntax")) {
      return res.status(400).json({
        error: "Invalid input type.",
      });
    }
    res.status(500).json({ error: "Server error" });
    return true;
  }

  if (!data || data.length === 0) {
    console.error(message);
    res.status(404).json({ message });
    return true;
  }
};

// Used for the count routes to iterate through the data, accumulating thr value and returning the key value pairs of the attribute and its count
exports.countItems = (data, value, attribute = "key") => {
  const count = {};
  data.forEach((item) => {
    const key = value(item);
    count[key] = (count[key] || 0) + 1;
  });
  return Object.keys(count).map((key) => ({
    [attribute]: key,
    count: count[key],
  }));
};