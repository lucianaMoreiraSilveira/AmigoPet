require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY; // Chave anon do projeto

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testResetEmail(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Erro ao enviar e-mail:", error.message);
    } else {
      console.log("E-mail de redefinição disparado com sucesso para:", email);
    }
  } catch (err) {
    console.error("Erro interno:", err);
  }
}

// E-mail de teste
const emailTeste = "seuemail@gmail.com";
testResetEmail(emailTeste);
