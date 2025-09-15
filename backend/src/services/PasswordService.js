// services/PasswordService.js
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

class PasswordService {
  constructor(userRepository) {
    this.userRepository = userRepository;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  async authenticateUser(email, password) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || user.error) {
      throw new Error('Usuário não encontrado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Senha incorreta');
    }

    return user;
  }


  async requestPasswordReset(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");

    const token = uuidv4();
    user.reset_token = token;
    user.reset_token_expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.userRepository.updateUser(user);

    const resetUrl = `http://localhost:8080/reset?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Redefinição de senha",
      html: `<p>Você solicitou a redefinição de senha.</p>
             <p>Clique no link abaixo para redefinir:</p>
             <a href="${resetUrl}">${resetUrl}</a>`
    });

    console.log(`E-mail de redefinição enviado para ${email}`);
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
