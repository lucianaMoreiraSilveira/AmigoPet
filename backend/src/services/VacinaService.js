const Vacina = require("../entities/Vacina");

class VacinaService {
  constructor(vacinaRepository) {
    this.vacinaRepository = vacinaRepository;
  }

  async registrar(dados, usuarioId) {
    if (!usuarioId) throw new Error("Usuário não autenticado.");
    const vacina = new Vacina({ ...dados, usuario_id: usuarioId });
    return await this.vacinaRepository.create(vacina);
  }

  async listar(usuarioId) {
    if (!usuarioId) throw new Error("Usuário não autenticado.");
    return await this.vacinaRepository.findAllByUser(usuarioId);
  }

  async buscarPorId(id, usuarioId) {
    if (!usuarioId) throw new Error("Usuário não autenticado.");
    return await this.vacinaRepository.findById(id, usuarioId);
  }

  async atualizar(id, usuarioId, dados) {
    if (!usuarioId) throw new Error("Usuário não autenticado.");
    return await this.vacinaRepository.update(id, usuarioId, dados);
  }

  async deletar(id, usuarioId) {
    if (!usuarioId) throw new Error("Usuário não autenticado.");
    return await this.vacinaRepository.delete(id, usuarioId);
  }
}

module.exports = VacinaService;
