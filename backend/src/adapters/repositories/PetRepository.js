const supabase = require("../../frameworks/supabaseClient");
class PetRepository {
  async getAllPets() {
    try {
      const { data, error } = await supabase.from("pet").select("*");

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message || "Unexpected error" };
    }
  }



async registerpet(pet) {
  try {
    // Remove id caso venha por engano
    const { id, ...petData } = pet;

    // Adiciona created_at se não existir
    const newPet = { ...petData, created_at: pet.created_at || new Date() };

    // Inserção no Supabase
    const { data, error } = await supabase
      .from("pet")
      .insert([newPet])
      .select()
      .single(); // retorna apenas um registro

    if (error) return { error: error.message };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

  async getAllPet() {
  try {
    const { data, error } = await supabase
      .from("pet")
      .select("*"); // busca todos os pets

    if (error) return { error: error.message };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

async searchPet(filters) {
  const { name, specie, sex, age, size, adotado } = filters;

  if (adotado === undefined) {
    throw new Error('Campo "adotado" é obrigatório');
  }

  try {
    let query = supabase.from("pet").select("*");

    // filtro obrigatório
    query = query.eq("adotado", adotado);

    if (name) {
      query = query.ilike("name", `%${name}%`);
    }
    if (specie) {
      query = query.eq("specie", specie);
    }
    if (sex) {
      query = query.eq("sex", sex);
    }
    if (age) {
      query = query.eq("age", age);
    }
    if (size) {
      query = query.eq("size", size);
    }

    const { data, error } = await query;

    if (error) return { error: error.message };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}


  async deletePet(id) {
  const { data, error } = await supabase
    .from("pet")
    .delete()
    .eq("id", id)
    .select()
    .single(); // garante retorno de um único registro

  if (error) return { error: error.message };
  return data;
}


  async updatePet(id, dataToUpdate) {
  const { data, error } = await supabase
    .from("pet")
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single(); // retorna o pet atualizado

  if (error) return { error: error.message };
  return data;
}

async findById(petId) {
  const { data, error } = await supabase
    .from("pet")
    .select("*")
    .eq("id", petId)
    .single(); // retorna apenas 1 registro

  if (error) return { error: error.message };
  return data;
}


async findPostsByPetId(petId) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("pet_id", petId);

  if (error) return { error: error.message };
  return data;
}


async findSettingsByPetId(petId) {
  try {
    const { data, error } = await supabase
      .from("pet_settings")
      .select("*")
      .eq("pet_id", petId)
      .single(); // como só deve existir 1 registro por pet

    if (error) {
      console.error("Erro ao buscar configurações do pet:", error.message);
      return {};
    }

    return data || {};
  } catch (error) {
    console.error("Erro inesperado ao buscar configurações do pet:", error);
    return {};
  }
}
async marcarComoAdotado(id) {
  const { data, error } = await supabase
    .from("pet")
    .update({ adotado: true })
    .eq("id", id)
    .select()
    .single(); // Isso ajuda a capturar caso nenhuma linha seja encontrada

  if (error) {
    console.error('Erro Supabase:', error);
    return { error: error.message };
  }

  if (!data) {
    return { error: 'Pet não encontrado ou update não autorizado' };
  }

  return data;
}


  async getPet() {
  try {
    const { data, error } = await supabase
      .from("pet")
      .select("*")
      .eq("adotado", true); // filtra apenas pets adotados

    if (error) return { error: error.message };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}


async marcarComoAdotado(id) {
  try {
    const { data, error } = await supabase
      .from("pet")
      .update({ adotado: true }) // atualiza para true
      .eq("id", id)
      .select()
      .single(); // retorna o registro atualizado

    if (error) return { error: error.message };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}
async getPetByAdotado(adotado) {
  try {
    const { data, error } = await supabase
      .from("pet")
      .select("*")
      .eq("adotado", adotado); // filtra true ou false

    if (error) return { error: error.message };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

}




module.exports = PetRepository;

