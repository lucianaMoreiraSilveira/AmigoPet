const database = require("../../frameworks/PgDatabase");
const PetService = require("../../services/PetService");
const PetRepository = require("../repositories/PetRepository"); // importa a classe

const petRepository = new PetRepository(database); // instancia corretamente


  async function getAllPet(request, reply) {
    const service = new PetService(petRepository);
    const replyService = await service.getAllPet();
  
    if (replyService.error) {
      return reply.status(500).send({ error: replyService.error });
    }
  
    reply.status(200).send({ pet: replyService });
};


async function registerpet(request, reply) {
  const data = request.body;

  const service = new PetService(petRepository); // usa a instância correta
  const replyService = await service.registerpet(data);

  if (replyService.error) {
    return reply.status(500).json({ error: replyService.error });
  }

  reply.status(201).json({ status: replyService });
}
//admin
 async function  deletePet(request, reply) {
    const { id } = request.params;

    const result = await petService.deletePet(id);

    if (result.error) {
      return reply.status(404).json({ error: result.error });
    }

    return reply.status(200).json({ message: 'Pet deletado com sucesso' });
  }
//admin
async function updatePet(request, reply) {
  const { id } = request.params;
  const { avatar, name } = request.body;

  try {
    const result = await petService.updatePet(id, { avatar, name });

    if (result.error) {
      return reply.status(404).json({ error: result.error }); // 404 para "não encontrado"
    }

    return reply.status(200).json({ message: "Pet atualizado com sucesso", pet: result });
  } catch (error) {
    // captura erros inesperados
    return reply.status(500).json({ error: error.message });
  }
}








// Controller
const petService = new PetService(petRepository); // Cria a instância corretamente

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



  async function updateUser(req, res) {
    const { id } = req.params;
    const { nome, email } = req.body;
  
    const result = await userService.updateUser(id, { nome, email });
  
    if (result?.error) {
      return res.status(500).json({ error: result.error });
    }
  
    if (!result) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  
    res.status(200).json({ message: 'Usuário atualizado com sucesso', user: result });
  }
}
  



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
async function marcarComoAdotado(request, reply) {
  try {
    const petId = request.params.id;

    if (!petId) {
      return reply.status(400).send({ error: 'ID do pet é obrigatório' });
    }

    const result = await petService.marcarComoAdotado(petId);

    if (!result) {
      return reply.status(404).send({ error: 'Pet não encontrado' });
    }

    return reply.status(200).send({ message: 'Pet marcado como adotado com sucesso' });
  } catch (error) {
    console.error('Erro ao marcar como adotado:', error);
    return reply.status(500).send({ error: error.message });
  }
}

async function getPet(req, res) {
  try {
    const adotado = req.query.adotado;

    if (adotado === undefined) {
      return res.status(400).json({ error: 'Parâmetro "adotado" é obrigatório' });
    }

    let adotadoBool;
    if (adotado === 'true') {
      adotadoBool = true;
    } else if (adotado === 'false') {
      adotadoBool = false;
    } else {
      return res.status(400).json({ error: 'Parâmetro "adotado" deve ser "true" ou "false"' });
    }

    const pet = await petService.getPetByAdotado(adotadoBool);
    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



module.exports = { 
  registerpet,
  getAllPet,
  searchPet,
   deletePet, 
   updatePet,
  getPetWithAllData,
marcarComoAdotado,
getPet };
