const supabase = require("../../frameworks/supabaseClient");

class PasswordRepository {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle(); // não gera erro se não achar nada

    if (error) {
      console.error("Erro em findByEmail:", error);
      return { error: error.message };
    }
    return data;
  }

  async findByResetToken(token) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("reset_token", token)
      .gt("reset_token_expires", now)
      .maybeSingle();

    if (error) {
      console.error("Erro em findByResetToken:", error);
      return { error: error.message };
    }
    return data;
  }

  async updateUser(user) {
    const { error } = await supabase
      .from("users")
      .update({
        password: user.password,
        reset_token: user.reset_token,
        reset_token_expires: user.reset_token_expires,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Erro em updateUser:", error);
      return { error: error.message };
    }
    return { success: true };
  }
}


module.exports = PasswordRepository;
