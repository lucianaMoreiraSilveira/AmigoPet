const { createClient } = require('@supabase/supabase-js');

class WhatsappRepository {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY // chave de serviço segura para backend
    );
  }

  async findTutorPhoneByPetId(petId) {
    try {
      const { data, error } = await this.supabase
        .from('pet')
        .select('tutor')
        .eq('id', petId)
        .single();

      if (error) throw new Error(error.message);
      return data; // retorna { tutor: '5511998765432' } ou null
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = WhatsappRepository;
