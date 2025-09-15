const supabase = require("../frameworks/supabaseClient");

class PasswordService {
  async requestPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password" // coloque a URL da sua tela de reset
    });

    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  }

  async resetPassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}

module.exports = PasswordService;
