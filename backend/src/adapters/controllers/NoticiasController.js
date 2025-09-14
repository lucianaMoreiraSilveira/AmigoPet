const database = require("../../frameworks/PgDatabase");
const NoticiasService = require("../../services/NoticiasService");
const NoticiasRepository = require("../repositories/NoticiasRepository");

const noticiasRepository = new NoticiasRepository(database);
const noticiasService = new NoticiasService(noticiasRepository);

async function getAllNoticias(req, res) {
  try {
    const allNoticias = await noticiasService.getAllNoticias();

    if (allNoticias.error) {
      return res.status(500).json({ error: allNoticias.error });
    }

    res.status(200).json({ noticias: allNoticias });
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    res.status(500).json({ error: error.message });
  }
}

async function registerNoticia(req, res) {
  try {
    console.log("Corpo recebido no controller:", req.body);
    const newNoticia = await noticiasService.registerNoticia(req.body);
    res.status(201).json(newNoticia);
  } catch (error) {
    console.error("Erro ao registrar notícia:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllNoticias,
  registerNoticia,
};
