const sgMail = require("@sendgrid/mail");


class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendPasswordReset(email, token) {
    const resetUrl = `http://localhost:8080/reset?token=${token}`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Redefinição de senha",
      text: `Você solicitou a redefinição de senha. Acesse este link: ${resetUrl}`,
      html: `<p>Você solicitou a redefinição de senha.</p>
             <p><a href="${resetUrl}">Clique aqui para redefinir sua senha</a></p>`,
    };

    await sgMail.send(msg);
    console.log(`E-mail de redefinição enviado para ${email}`);
  }
}

module.exports = EmailService;
