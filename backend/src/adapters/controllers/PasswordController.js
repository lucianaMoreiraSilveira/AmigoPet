// controllers/PasswordController.js
const PasswordService = require('../../services/PasswordService');
const passwordService = new PasswordService();

const PasswordController = {
  // Solicita o envio do email de redefinição de senha
  async requestReset(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "O campo 'email' é obrigatório" });
      }

      await passwordService.requestPasswordReset(email);
      res.status(200).json({ message: "Se o email estiver cadastrado, você receberá um link de recuperação" });
    } catch (err) {
      console.error("Erro em requestReset:", err);
      res.status(500).json({ error: "Erro ao enviar email de recuperação" });
    }
  },

  // Redefine a senha usando o token enviado pelo Supabase
  async resetPassword(req, res) {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: "A nova senha é obrigatória" });
      }

      // O token deve estar configurado no cliente Supabase pelo front-end
      await passwordService.resetPassword(password);
      res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (err) {
      console.error("Erro em resetPassword:", err);
      res.status(500).json({ error: "Erro ao redefinir senha" });
    }
  }
};

module.exports = PasswordController;
