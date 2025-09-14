class Pet {
    constructor(
      name,
      specie,
      sex,
      age,
      size,
      state_id,
      city_id,
      description,
      avatar,
      tutor,
  
      // Cuidados veterinários
      castrated,
      vaccinated,
      vermifugate,
      need_special_care,
  
      // Temperamento
      docile,
      aggressive,
      calm,
      playful,
      sociable,
      aloof,
      independent,
      needy,
  
      // Vive bem com
      friendly_with_house_with_backyard,
      friendly_with_apartment,
  
      // Sociável com
      sociability_cats,
      sociability_dogs,
      sociability_children,
      sociability_unknown,
  
      created_at
    ) {
      this.id = 0; // será preenchido pelo banco
      this.name = name;
      this.specie = specie;
      this.sex = sex;
      this.age = age;
      this.size = size;
      this.state_id = state_id;
      this.city_id = city_id;
      this.description = description;
      this.avatar = avatar;
      this.tutor = tutor;
  
      // Cuidados veterinários
      this.castrated = castrated;
      this.vaccinated = vaccinated;
      this.vermifugate = vermifugate;
      this.need_special_care = need_special_care;
  
      // Temperamento
      this.docile = docile;
      this.aggressive = aggressive;
      this.calm = calm;
      this.playful = playful;
      this.sociable = sociable;
      this.aloof = aloof;
      this.independent = independent;
      this.needy = needy;
  
      // Vive bem com
      this.friendly_with_house_with_backyard = friendly_with_house_with_backyard;
      this.friendly_with_apartment = friendly_with_apartment;
  
      // Sociável com
      this.sociability_cats = sociability_cats;
      this.sociability_dogs = sociability_dogs;
      this.sociability_children = sociability_children;
      this.sociability_unknown = sociability_unknown;
  
      this.created_at = created_at; // new Date().toISOString()
    }
  }
  
  module.exports = Pet;
  