require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️ Variáveis de ambiente não carregadas!");
  console.error("SUPABASE_URL:", supabaseUrl);
  console.error("SUPABASE_KEY:", supabaseKey ? "definida" : "undefined");
  throw new Error("Faltam variáveis de ambiente: SUPABASE_URL ou SUPABASE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;