const Pet = require("../entities/Pet");

class PetService {
  constructor(petRepository) {
    this.petRepository = petRepository;
  }

  async registerpet(data) {
    console.log(data);

    const pet = new Pet(
      data.name,
      data.specie,
      data.sex,
      data.age,
      data.size,
      data.state_id,
      data.city_id,
      data.description,
      data.avatar,
      data.tutor_id,

      // Cuidados veterinários
      data.castrated,
      data.vaccinated,
      data.vermifugate,
      data.need_special_care,

      // Temperamento
      data.docile,
      data.aggressive,
      data.calm,
      data.playful,
      data.sociable,
      data.aloof,
      data.independent,
      data.needy,

      // Vive bem com
      data.friendly_with_house_with_backyard,
      data.friendly_with_apartment,

      // Sociável com
      data.sociability_cats,
      data.sociability_dogs,
      data.sociability_children,
      data.sociability_unknown,

      // Timestamp
      data.created_at
    );

    return await this.petRepository.registerpet(pet);
  }

  async findPetById(id) {
    const pet = await this.petRepository.findPetById(id);
    if (!pet) {
      return { error: "Pet not found", code: 404 };
    }
    return pet;
  }

  async getAllPet() {
    try {
      return await this.petRepository.getAllPet();
    } catch (error) {
      return { error: error.message };
    }
  }

  async searchPet(filters) {
    return await this.petRepository.searchPet(filters);
  }

  async deletePet(id) {
    try {
      const deletedPet = await this.petRepository.deletePet(id);
      if (!deletedPet) {
        return { error: 'Pet não encontrado' };
      }
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  async updatePet(id, data) {
    try {
      return await this.petRepository.updatePet(id, data);
    } catch (error) {
      return { error: error.message };
    }
  }
  


  async getPetWithAllData(id) {
  const pet = await this.petRepository.findById(id);
  if (!pet) return null;

  const settings = await this.petRepository.findSettingsByPetId(id);

  return {
    ...pet,
    settings
  };
}
 async marcarComoAdotado(id) {
  // Busca o pet pelo id
  const pet = await this.petRepository.findById(id);
  
  if (!pet) {
    // Se não existir, lança erro para ser tratado no controller
    throw new Error('Pet não encontrado');
  }

  // Marca o pet como adotado
  pet.adotado = true;

  // Atualiza o pet no banco, aguardando a operação completar
  const atualizado = await this.petRepository.updatePet(id, pet);

  return atualizado; // retorna o pet atualizado, opcional
}


async getPet() {
    try {
      return await this.petRepository.getPet();
    } catch (error) {
      return { error: error.message };
    }
  }
  async getPetByAdotado(adotado) {
  try {
    return await this.petRepository.getPetByAdotado(adotado);
  } catch (error) {
    return { error: error.message };
  }
}

}
  

module.exports = PetService;
