const PasswordService = require('../../services/PasswordService');
const passwordService = new PasswordService();

const PasswordController = {
  async requestReset(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "O campo 'email' é obrigatório" });
      }

      await passwordService.requestPasswordReset(email);
      res.status(200).json({ message: "Email de recuperação enviado" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: "A nova senha é obrigatória" });
      }

      await passwordService.resetPassword(password);
      res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = PasswordController;
