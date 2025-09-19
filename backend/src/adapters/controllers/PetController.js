const supabase = require("../../frameworks/supabaseClient");
const PetService = require("../../services/PetService");
const PetRepository = require("../repositories/PetRepository");

const petRepository = new PetRepository(supabase);
const petService = new PetService(petRepository);

// GET all pets
async function getAllPet(req, res) {
  try {
    const pets = await petService.getAllPet();

    if (!pets) {
      return res.status(404).json({ error: "Nenhum pet encontrado" });
    }

    return res.status(200).json({ pet: pets });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// POST register pet
async function registerpet(req, res) {
  try {
    const data = req.body;
    const result = await petService.registerpet(data); // usa a instância petService

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(201).json({ status: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// DELETE pet (admin)
async function deletePet(req, res) {
  try {
    const { id } = req.params;
    const result = await petService.deletePet(id);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    return res.status(200).json({ message: "Pet deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// PUT update pet (admin)
async function updatePet(req, res) {
  try {
    const { id } = req.params;
    const { avatar, name } = req.body;

    const result = await petService.updatePet(id, { avatar, name });

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    return res.status(200).json({ message: "Pet atualizado com sucesso", pet: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Search pets
async function searchPet(req, res) {
  try {
    const filters = req.body;

    if (filters.adotado === undefined) {
      return res.status(400).json({ error: 'Campo "adotado" é obrigatório no corpo da requisição' });
    }

    const pets = await petService.searchPet(filters);
    res.json({ pet: pets });
  } catch (error) {
    console.error("Erro na busca de pets:", error);
    res.status(500).json({ error: error.message });
  }
}

// GET pet with all related data
async function getPetWithAllData(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID do pet é obrigatório' });
    }

    const petData = await petService.getPetWithAllData(id);

    if (!petData) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    res.json(petData);
  } catch (error) {
    console.error('Erro ao buscar dados do pet:', error);
    res.status(500).json({ error: 'Erro interno ao buscar dados do pet' });
  }
}

// Marcar pet como adotado
async function marcarComoAdotado(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID do pet é obrigatório' });
    }

    const result = await petService.marcarComoAdotado(id);

    if (!result) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    return res.status(200).json({ message: 'Pet marcado como adotado com sucesso' });
  } catch (error) {
    console.error('Erro ao marcar como adotado:', error);
    return res.status(500).json({ error: error.message });
  }
}

// GET pets filtrando por adotado
async function getPet(req, res) {
  try {
    const adotado = req.query.adotado;

    if (adotado === undefined) {
      return res.status(400).json({ error: 'Parâmetro "adotado" é obrigatório' });
    }

    let adotadoBool;
    if (adotado === 'true') adotadoBool = true;
    else if (adotado === 'false') adotadoBool = false;
    else return res.status(400).json({ error: 'Parâmetro "adotado" deve ser "true" ou "false"' });

    const pet = await petService.getPetByAdotado(adotadoBool);
    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { 
  getAllPet,
  registerpet,
  deletePet,
  updatePet,
  searchPet,
  getPetWithAllData,
  marcarComoAdotado,
  getPet
};
