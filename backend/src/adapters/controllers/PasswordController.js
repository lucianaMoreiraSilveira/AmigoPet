const supabase = require("../../frameworks/supabaseClient");
const PasswordRepository = require('../repositories/PasswordRepository');
const PasswordService = require('../../services/PasswordService');

const passwordRepository = new PasswordRepository(supabase);
const passwordService = new PasswordService(passwordRepository);


async function requestReset(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "O campo 'email' é obrigatório" });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://amigopet.onrender.com/reset"
    });

    if (error) {
      console.error("Erro Supabase:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Email de recuperação enviado" });
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

async function resetPassword(req, res) {
  try {
    const { password } = req.body;
    // Esse endpoint só funciona depois que o usuário clicou no link enviado pelo Supabase,
    // que traz o `access_token` na URL. Ele deve ser capturado no frontend.
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

module.exports = {
  requestReset,
  resetPassword
};