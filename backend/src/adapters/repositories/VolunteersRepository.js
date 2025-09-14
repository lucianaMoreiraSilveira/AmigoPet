const supabase = require("../../frameworks/supabaseClient");



class VolunteersRepository {
  async getAllVolunteers() {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*");

      if (error) {
        return { error: error.message };
      }

      return data;
    } catch (err) {
      // Handle unexpected errors (e.g., network issues)
      return { error: err.message || "Unexpected error occurred" };
    }
  }
  
async registerVolunteers(volunteer) {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .insert([volunteer])
        .select();

      if (error) {
        return { error: error.message };
      }

      return data;
    } catch (err) {
      return { error: err.message || "Unexpected error occurred" };
    }
  }

  async updateVolunteers(id, { name, email, role }) {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .update({ name, email, role })
      .eq('id', id)
      .select()
     

    if (error) {
      return { error: error.message };
    }

    return data;
  } catch (err) {
    return { error: err.message || 'Unexpected error occurred' };
  }
}

  async deleteVolunteers(id) {
    const { data, error } = await supabase
      .from('volunteers')
      .delete()
      .eq('id', id)
      .select()
     

    if (error) return { error: error.message };
    return { success: true, deleted: data };
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', id)
    

    if (error) return null;
    return data;
  }
}

module.exports = VolunteersRepository;
