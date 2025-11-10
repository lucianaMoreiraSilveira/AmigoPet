const VacinaService = require("../../services/VacinaService");
const VacinaRepository = require("../repositories/VacinaRepository");
const supabase = require("../../frameworks/supabaseClient");

const vacinaRepository = new VacinaRepository();
const vacinaService = new VacinaService(vacinaRepository);

// Cria nova vacina (usuário logado)
async function registrar(req, res) {
  try {
    const { user } = req; // vem do middleware de autenticação
    const dados = req.body;
    const result = await vacinaService.registrar(dados, user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listar(req, res) {
  try {
    const { user } = req;
    const vacinas = await vacinaService.listar(user.id);
    res.json(vacinas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const { user } = req;
    const { id } = req.params;
    const vacina = await vacinaService.buscarPorId(id, user.id);
    res.json(vacina);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function atualizar(req, res) {
  try {
    const { user } = req;
    const { id } = req.params;
    const result = await vacinaService.atualizar(id, user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletar(req, res) {
  try {
    const { user } = req;
    const { id } = req.params;
    await vacinaService.deletar(id, user.id);
    res.json({ message: "Registro excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports =
 { registrar, 
    listar, 
    buscarPorId,
     atualizar, 
     deletar };
