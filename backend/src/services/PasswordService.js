const bcrypt = require("bcryptjs");
const { Resend } = require("resend");
const { v4: uuidv4 } = require("uuid");

class PasswordService {
  constructor(userRepository) {
    this.userRepository = userRepository;

    if (!process.env.RESEND_API_KEY) {
      throw new Error("A variável RESEND_API_KEY é obrigatória no ambiente");
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async requestPasswordReset(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");

    const token = uuidv4();
    user.reset_token = token;
    user.reset_token_expires = new Date(Date.now() + 60 * 60 * 1000);
    await this.userRepository.updateUser(user);

    const resetUrl = `https://amigopet-d0856.web.app/redefinir-senha.html?token=${token}`;

    try {
      await this.resend.emails.send({
        from: "Amigo Pet <amigopet37@gmail.com>", // pode mudar depois para domínio verificado
        to: email,
        subject: "Redefinição de senha - AmigoPet",
        html: `
          <p>Você solicitou a redefinição de senha.</p>
          <p>Clique no link abaixo para redefinir sua senha. O link é válido por 1 hora:</p>
          <a href="${resetUrl}">${resetUrl}</a>
        `,
      });

      console.log(`E-mail de redefinição enviado para ${email}`);
    } catch (err) {
      console.error("Erro ao enviar e-mail:", err);
      throw new Error("Não foi possível enviar o e-mail de redefinição de senha");
    }
  }




  async resetPassword(token, newPassword) {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) throw new Error("Token inválido ou expirado");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires = null;

    await this.userRepository.updateUser(user);
  }
}

module.exports = PasswordService;
