const database = require("../../frameworks/PgDatabase");
const WhatsappService = require("../../services/WhatsappService");
const WhatsappRepository = require("../repositories/WhatsappRepository");

const whatsappRepository = new WhatsappRepository(database);
const whatsappService = new WhatsappService(whatsappRepository);

async function getTutorPhoneByPetId(req, res) {
  try {
    const petId = parseInt(req.params.id);
    if (isNaN(petId)) {
      return res.status(400).json({ error: 'ID do pet inválido' });
    }

    const phoneObj = await whatsappService.getTutorPhoneByPetId(petId);

    if (!phoneObj || !phoneObj.tutor) {
      return res.status(404).json({ error: 'Número do tutor não encontrado' });
    }

    return res.json({ phone: phoneObj.tutor });
  } catch (error) {
    console.error('Erro no getTutorPhoneByPetId:', error);
    return res.status(500).json({ error: 'Erro ao buscar número do tutor' });
  }
}

module.exports = {
  getTutorPhoneByPetId,
};