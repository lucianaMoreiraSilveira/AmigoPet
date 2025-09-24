

const supabase = require("../../frameworks/supabaseClient");

class UserRepository {
  async getAllUsers() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) return { error: error.message };
    return data;
  }

  async registerUser(user) {
    const { data, error } = await supabase
      .from("users")
      .insert([{
        nome: user.nome,
        email: user.email,
        whatsapp: user.whatsapp,
        password: user.password,
        entrou_com_facebook: user.entrou_com_facebook,
        entrou_com_google: user.entrou_com_google,
        quer_divulgar: user.quer_divulgar,
        quer_adotar: user.quer_adotar,
        criado_em: user.criado_em,
        role: "user"
      }])
      .select()
      .single();

    if (error) return { error: error.message };
    return data;
  }

    async getUserByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return { error: error.message };
    return data;
  }

  async updateUser(id, { nome, email }) {
    const { data, error } = await supabase
      .from("users")
      .update({ nome, email })
      .eq("id", id)
      .select();

    if (error) return { error: error.message };
    return data;
  }

  async deleteUser(id) {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) return { error: error.message };
    return { success: true };
  }

  async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Erro no findByEmail:", error.message);
      return { error: error.message };
    }

    return data;
  }

  async findByName(nome) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("nome", `%${nome}%`);

    if (error) {
      console.error("Erro no findByName:", error.message);
      return { error: error.message };
    }

    return data;
  }

  async getAllUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("id, nome, email, role");
    if (error) return { error: error.message };
    return data;
  }

  async findById(id) {
    if (!supabase) throw new Error("Supabase client não inicializado");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      return null;
    }

    return data || null;
  }

  async findPostsByUserId(userId) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao buscar posts do usuário:", error);
      return [];
    }

    return data || [];
  }

  async findSettingsByUserId(userId) {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Erro ao buscar settings do usuário:", error);
      return null;
    }

    return data || null;
  }
}
module.exports = UserRepository;