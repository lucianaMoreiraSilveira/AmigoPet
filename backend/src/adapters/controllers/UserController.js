const supabase = require("../../frameworks/supabaseClient");
const UserService = require("../../services/UserService");
const UserRepository = require("../repositories/UserRepository");
const jwt = require("jsonwebtoken");

const userRepository = new UserRepository(supabase);
const userService = new UserService(userRepository);

/* 
  Return all users from the Database 
*/
async function getAllUsers(request, reply) {
  const service = new UserService(userRepository);
  const replyService = await service.getAllUsers();

  if (replyService.error) {
    return reply.status(500).json({ error: replyService.error });
  }

  reply.status(200).json({ users: replyService });
}

/* 
  Register a user in the Database 
*/
async function registerUser(req, res) {
  try {
    console.log("Corpo recebido:", req.body); // <-- VER O QUE CHEGA
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error); // <-- LOGAR ERRO
    res.status(500).json({ error: error.message });
  }
}
/* 
  Login user and generate JWT token
*/
/* 
  Login user and generate JWT token
*/

async function loginUser(request, reply) {
  const dataLogin = request.body;

  const service = new UserService(userRepository);
  const replyService = await service.authenticateUser(dataLogin)
  

  if (replyService.error) {
    return reply.status(replyService.code || 500).json({ error: replyService.error });
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    quer_adotar: user.quer_adotar,
    quer_divulgar: user.quer_divulgar
};


  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "5m" });

  // Verifique se o token foi gerado corretamente
  if (!token) {
    return reply.status(500).json({ error: "Erro ao gerar o token." });
  }

 let redirect = "";

if (replyService.user.role === "admin") {
  redirect = "admin.html";
} else if (replyService.user.quer_adotar === true) {
  redirect = "quer_adotar.html";
} else {
  redirect = "quer_divulgar.html";
}
  // Verifique se o redirect foi corretamente atribuído
  if (!redirect) {
    return reply.status(500).json({ error: "Erro ao definir o redirecionamento." });
  }

  return reply.status(200).json({ token, redirect });
}


/* Rotas ainda não implementadas */

async function adminUser(request, reply) {
  reply.json("");
}

async function quer_adotarUser(request, reply) {
  reply.json("");
}

async function quer_divulgarUser(request, reply) {
  reply.json("");
}




//admin
async function updateUser(req, res) {
  const { id } = req.params;
  const { nome, email } = req.body;

  const result = await userService.updateUser(id, { nome, email });

  if (result?.error) {
    return res.status(500).json({ error: result.error });
  }

 if (!nome) {
  return res.status(400).json({ error: "O nome é obrigatório" });
}


  res.status(200).json({ message: 'Usuário atualizado com sucesso', user: result });
}



async function deleteUser(request, reply) {
  const { id } = request.params;

  
  

  const result = await userService.deleteUser(id, (id));

  if (result.error) {
    return reply.status(500).send({ error: result.error });
  }

  return reply.status(200).send({ message: "Usuário deletado com sucesso" });
}

// Apenas um mock para exemplo, substitua pelo seu service real




async function getUserWithAllData(req, res) {
  const { id } = req.params;
  const userData = await userService.getUserWithAllData(id);

  if (!userData) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.json(userData);
}
// Controller: searchUsersByNome
async function searchUsersByNome(req, res) {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "O nome é obrigatório" });
    }

    const users = await userService.searchUsersByNome(nome);

    if (!users || users.error) {
      return res.status(404).json({ error: users.error || "Nenhum usuário encontrado" });
    }

    if (users.length === 0) {
      return res.status(404).json({ error: "Nenhum usuário encontrado" });
    }

    return res.status(200).json(users);

  } catch (error) {
    console.error("Erro ao buscar usuários por nome:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}








module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  adminUser,
 quer_adotarUser,
  quer_divulgarUser,
  updateUser,
  deleteUser,
  getUserWithAllData,
  searchUsersByNome
  

};
