const Volunteers = require("../entities/Volunteers"); // Entidade com nome correto (classe)
class VolunteersService {
  constructor(volunteersRepository) {
    this.volunteersRepository = volunteersRepository; // nome correto
  }

  async getAllVolunteers() {
    return await this.volunteersRepository.getAllVolunteers();
  }

  async registerVolunteers(data) {
    // Supondo que os campos enviados sejam: name, email, role
    const volunteer = new Volunteers(data.name, data.email, data.role);

    return await this.volunteersRepository.registerVolunteers(volunteer);
  }
 
//admin
 async updateVolunteers(id, data) {
    try {
      return await this.volunteersRepository.updateVolunteers(id, data);
    } catch (error) {
      return { error: error.message };
    }
  }
   async deleteVolunteers(id) {
    try {
      return await this.volunteersRepository.deleteVolunteers(id);
    } catch (error) {
      return { error: error.message };
    }
  }
 async getVolunteersWithAllData(id) {
  const user = await this.volunteersRepository.findById(id);
  if (!user) return null;

  // Se não tem posts e settings, pode retornar só o user
  return { ...user };
}
}


module.exports = VolunteersService;
