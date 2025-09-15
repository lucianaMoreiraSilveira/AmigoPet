const supabase = require("../frameworks/supabaseClient");

class PasswordService {
  // Solicita o email de redefinição de senha
  async requestPasswordReset(email) {
    const redirectUrl = process.env.NODE_ENV === 'production'
      ? `${process.env.FRONTEND_URL}/reset-password`
      : 'http://localhost:3000/reset-password';

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    console.log("Supabase resetPasswordForEmail:", { data, error });

    if (error) throw new Error(error.message);
    return { success: true };
  }

  // Redefine a senha usando o token de acesso
  async resetPassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = PasswordService;
