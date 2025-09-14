class WhatsappService {
  constructor(whatsappRepository) {
    this.whatsappRepository = whatsappRepository;
  }

   async getTutorPhoneByPetId(petId) {
    try {
      // Aqui usamos this.whatsappRepository, que deve estar definido
      const phone = await this.whatsappRepository.findTutorPhoneByPetId(petId);
      return phone;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = WhatsappService;

