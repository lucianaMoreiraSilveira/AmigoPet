const PasswordRepository = require('../repositories/PasswordRepository');
const PasswordService = require('../../services/PasswordService');
const database = require('../../frameworks/PgDatabase');

const passwordRepository = new PasswordRepository(database);
const passwordService = new PasswordService(passwordRepository);

const PasswordController = {
  // Endpoint público para solicitar redefinição de senha
  async requestReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "O campo 'email' é obrigatório" });
      }

      await passwordService.requestPasswordReset(email);
      res.status(200).json({ message: "Email de recuperação enviado" });
    } catch (err) {
      // Pode ser "Usuário não encontrado" ou outro erro
      res.status(400).json({ error: err.message });
    }
  },

  // Endpoint público para redefinir a senha com token
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: "Token e nova senha são obrigatórios" });
      }

      await passwordService.resetPassword(token, password);
      res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (err) {
      // Pode ser "Token inválido ou expirado" ou outro erro
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = PasswordController;
