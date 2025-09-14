const supabase = require("../../frameworks/supabaseClient");

class NoticiasRepository {
  // Buscar todas as notícias
  async getAllNoticias() {
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return data;
  }

  // Criar uma nova notícia
  async registerNoticia(noticia) {
    const { data, error } = await supabase
      .from("noticias")
      .insert([
        {
          titulo: noticia.titulo,
          descricao: noticia.descricao,
          imagem: noticia.imagem,
          link: noticia.link,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = NoticiasRepository;
