const PasswordRepository = require('../repositories/PasswordRepository');
const PasswordService = require('../../services/PasswordService');
const supabase = require("../../frameworks/supabaseClient");

const passwordRepository = new PasswordRepository(supabase);
const passwordService = new PasswordService(passwordRepository);

async function requestReset(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "O campo 'email' é obrigatório" });
    }

    await passwordService.requestPasswordReset(email);
    res.status(200).json({ message: "Email de recuperação enviado" });
  } catch (err) {
    console.error("Erro em requestReset:", err);
    res.status(500).json({ error: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token e nova senha são obrigatórios" });
    }

    await passwordService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error("Erro em resetPassword:", err);
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  requestReset,
  resetPassword
};
