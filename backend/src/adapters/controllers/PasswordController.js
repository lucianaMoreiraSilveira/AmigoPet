const supabase = require("../../frameworks/supabaseClient");
const PasswordRepository = require('../repositories/PasswordRepository');
const PasswordService = require('../../services/PasswordService');

const passwordRepository = new PasswordRepository(supabase);
const passwordService = new PasswordService(passwordRepository);

// Endpoint público para solicitar redefinição de senha
async function requestReset(req, res) {
  try {
    const { email } = req.body;
    console.log("Recebido email:", email);

    if (!email) {
      return res.status(400).json({ error: "O campo 'email' é obrigatório" });
    }

   const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Erro Supabase:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Email enviado com sucesso:", data);
    res.status(200).json({ message: "Email de recuperação enviado" });
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

// Endpoint público para redefinir a senha com token
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token e nova senha são obrigatórios" });
    }

    // Atualiza a senha do usuário usando Supabase
    const { user, error } = await supabase.auth.api.updateUser(token, { password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

// Exportando no mesmo padrão do PetController
module.exports = {
  requestReset,
  resetPassword
};
