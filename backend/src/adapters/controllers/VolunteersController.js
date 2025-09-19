const supabase = require("../../frameworks/supabaseClient");
const VolunteersService = require("../../services/VolunteersService");
const VolunteersRepository = require("../repositories/VolunteersRepository");
const jwt = require("jsonwebtoken");

// Instância única (correta)
const volunteersRepository = new VolunteersRepository(supabase);
const volunteersService = new VolunteersService(volunteersRepository);

// GET: Retorna todos os voluntários
async function getAllVolunteers(req, res) {
  try {
    const volunteers = await volunteersService.getAllVolunteers();

    if (volunteers?.error) {
      return res.status(500).json({ error: volunteers.error });
    }

    res.status(200).json({ volunteers });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar voluntários", details: error.message });
  }
}

// POST: Registra um novo voluntário
async function registerVolunteers(req, res) {
  try {
    const data = req.body;
    const result = await volunteersService.registerVolunteers(data);

    if (result?.error) {
      return res.status(500).json({ error: result.error });
    }

    res.status(201).json({ status: result });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar voluntário", details: error.message });
  }
}

// PUT: Atualiza dados de um voluntário (admin)
async function updateVolunteers(req, res) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await volunteersService.updateVolunteers(id, { name, email });

    if (!result) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (result?.error) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ message: "Usuário atualizado com sucesso", volunteers: result });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar voluntário", details: error.message });
  }
}

// DELETE: Remove um voluntário (admin)
async function deleteVolunteers(req, res) {
  try {
    const { id } = req.params;

    const result = await volunteersService.deleteVolunteers(id);

    if (result?.error) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário", details: error.message });
  }
}

// GET: Busca voluntário por ID com dados completos
async function getVolunteersWithAllData(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário não fornecido" });
    }

    const volunteersData = await volunteersService.getVolunteersWithAllData(id);

    if (!volunteersData) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(volunteersData);
  } catch (error) {
    console.error("Erro ao buscar voluntário:", error);
    res.status(500).json({ error: "Erro interno do servidor", details: error.message });
  }
}

module.exports = {
  getAllVolunteers,
  registerVolunteers,
  updateVolunteers,
  deleteVolunteers,
  getVolunteersWithAllData,
};

 

  
  
  


module.exports = {
  getAllVolunteers,
  registerVolunteers,
  deleteVolunteers,
  updateVolunteers,
   getVolunteersWithAllData
};
