const supabase = require("../../frameworks/supabaseClient");

class VacinaRepository {
  async create(vacina) {
    const { data, error } = await supabase
      .from("vacinas")
      .insert([vacina])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAllByUser(userId) {
    const { data, error } = await supabase
      .from("vacinas")
      .select("*")
      .eq("usuario_id", userId)
      .order("criado_em", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id, userId) {
    const { data, error } = await supabase
      .from("vacinas")
      .select("*")
      .eq("id", id)
      .eq("usuario_id", userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id, userId, dados) {
    const { data, error } = await supabase
      .from("vacinas")
      .update(dados)
      .eq("id", id)
      .eq("usuario_id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id, userId) {
    const { error } = await supabase
      .from("vacinas")
      .delete()
      .eq("id", id)
      .eq("usuario_id", userId);

    if (error) throw new Error(error.message);
    return true;
  }
}

module.exports = VacinaRepository;
