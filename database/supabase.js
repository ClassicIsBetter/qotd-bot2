js
const ws = require("ws");
const { createClient } = require("@supabase/supabase-js");

const config = require("../config/config");

const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_KEY,
  {
    auth: {
      persistSession: false
    },

    realtime: {
      transport: ws
    }
  }
);

module.exports = supabase;

