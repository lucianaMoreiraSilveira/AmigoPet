const supabase = require("../../frameworks/supabaseClient");

class PasswordRepository {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data || null;
  }

  async findByResetToken(token) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("reset_token", token)
      .gt("reset_token_expires", now)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data || null;
  }

  async updateUser(user) {
    const { error } = await supabase
      .from("users")
      .update({
        password: user.password, // deve vir já hasheada
        reset_token: user.reset_token,
        reset_token_expires: user.reset_token_expires,
      })
      .eq("id", user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  }
}

module.exports = PasswordRepository;
