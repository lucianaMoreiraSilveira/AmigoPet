const Noticias = require("../entities/Noticias");

class NoticiasService {
  constructor(noticiasRepository) {
    this.noticiasRepository = noticiasRepository;
  }

  async getAllNoticias() {
    return await this.noticiasRepository.getAllNoticias();
  }

  async registerNoticia(data) {
    console.log("Dados recebidos para registro:", data);

    const noticia = new Noticias(data.titulo, data.descricao, data.imagem, data.link);

    return await this.noticiasRepository.registerNoticia(noticia);
  }
}

module.exports = NoticiasService;
