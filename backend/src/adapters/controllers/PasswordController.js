const supabase = require("../../frameworks/supabaseClient");
const PasswordRepository = require('../repositories/PasswordRepository');
const PasswordService = require('../../services/PasswordService');

const passwordRepository = new PasswordRepository(supabase);
const passwordService = new PasswordService(passwordRepository);

const PasswordController = {
  // Endpoint público para solicitar redefinição de senha
  async requestReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "O campo 'email' é obrigatório" });
      }

      // Envia email de redefinição de senha pelo Supabase
      const { data, error } = await supabase.auth.api.resetPasswordForEmail(email);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({ message: "Email de recuperação enviado" });
    } catch (err) {
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  // Endpoint público para redefinir a senha com token
  async resetPassword(req, res) {
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
};

module.exports = PasswordController;
