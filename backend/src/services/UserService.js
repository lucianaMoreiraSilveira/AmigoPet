const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken'); // Adicionando a importação do JWT

const User = require("../entities/User");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async registerUser(data) {
    console.log(data);

    const cryptPassword = await bcryptjs.hash(data.password, 10);
    const user = new User(data.nome, data.email, data.whatsapp, cryptPassword, data.entrou_com_facebook, data.entrou_com_google, data.quer_divulgar, data.quer_adotar, data.criado_em);

    return await this.userRepository.registerUser(user);
  }



   async authenticateUser({ email, password }) {
   const user = await this.userRepository.findByEmail(email);

if (!user) {
    return { error: "Usuário não encontrado", code: 404 };
}

const isPasswordValid = await bcryptjs.compare(password, user.password);
if (!isPasswordValid) {
    return { error: "Senha incorreta", code: 401 };
}

return { user };
}




  // Função para gerar o token JWT
  generateAuthToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    // Aqui, 'secret' é o segredo para assinar o token. Nunca deve ser hardcoded em produção, deve vir de um arquivo .env
    const secret = process.env.JWT_SECRET || 'seu-segredo';

    const options = {
      expiresIn: '1h', // O token expira em 1 hora
    };

    return jwt.sign(payload, secret, options);
  }
  async deleteUser(id) {
    try {
      return await this.userRepository.deleteUser(id);
    } catch (error) {
      return { error: error.message };
    }
  }
 async updateUser(id, data) {
    try {
      return await this.userRepository.updateUser(id, data);
    } catch (error) {
      return { error: error.message };
    }
  }

 async getUserWithAllData(id) {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    const posts = await this.userRepository.findPostsByUserId(id);
    const settings = await this.userRepository.findSettingsByUserId(id);

    return {
      ...user,
      posts,
      settings
    };
  }
 async searchUsersByNome(nome) {
  if (!nome || typeof nome !== 'string') return []; // retorno seguro

  try {
    // Chama o repository que faz a consulta no Supabase
    const users = await this.userRepository.findByName(nome);

    // Se houver erro no repository
    if (users?.error) {
      console.error("Erro no repository findByName:", users.error);
      return []; // ou throw new Error(users.error) se quiser tratar no controller
    }

    // Retorna sempre um array (mesmo se vazio)
    return users || [];
  } catch (error) {
    console.error("Erro no service searchUsersByNome:", error);
    throw error; // o controller vai tratar
  }

  
  
 
 async function findByName(nome) {
  console.log("Supabase client dentro do service:", supabase); // deve mostrar o objeto
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('nome', `%${nome}%`);

  if (error) return { error: error.message };
  return data;
}
 }
}


 







module.exports = UserService;
