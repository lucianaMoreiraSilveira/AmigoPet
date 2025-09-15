const { Router } = require("express");
const UserController = require("../adapters/controllers/UserController");
const Authenticate = require("./AuthenticateToken");
const PetController = require("../adapters/controllers/PetController");
const VolunteersController = require("../adapters/controllers/VolunteersController");
const PasswordController = require("../adapters/controllers/PasswordController");
const WhatsappController = require('../adapters/controllers/whatsappController');
const NoticiasController = require("../adapters/controllers/NoticiasController");




const routes = Router();

// Rotas de Notícias
routes.get("/noticias/all", NoticiasController.getAllNoticias);
routes.post("/noticias/register", NoticiasController.registerNoticia);

/* User Routes */
routes.get("/user/all", UserController.getAllUsers);
routes.post("/user/register", UserController.registerUser);
routes.post("/user/login", UserController.loginUser);
routes.put('/user/:id', UserController.updateUser);
routes.delete('/user/:id', UserController.deleteUser);
routes.get('/user/:id/all', UserController.getUserWithAllData);
routes.post("/user/search", UserController.searchUsersByNome);


routes.get('/pet/:id/whatsapp', WhatsappController.getTutorPhoneByPetId);


/*pet*/


routes.post("/pet/register", PetController.registerpet);
routes.get("/pet/all", PetController.getAllPet);

routes.delete("/pet/:id", PetController.deletePet);
routes.put("/pet/:id", PetController.updatePet);
routes.get('/pet/:id/all', PetController.getPetWithAllData);
routes.put('/pet/:id/adotar', PetController.marcarComoAdotado);
routes.get('/pet', PetController.getPet);
routes.post('/search', PetController.searchPet);




/*voluntarios*/
routes.get("/volunteers/all", VolunteersController.getAllVolunteers);
routes.post("/volunteers/register", VolunteersController.registerVolunteers);
routes.delete("/volunteers/:id", VolunteersController.deleteVolunteers);
routes.put("/volunteers/:id", VolunteersController.updateVolunteers);
routes.get('/volunteers/:id/all', VolunteersController.getVolunteersWithAllData);




/*redefinir senha*/

// rota pública para solicitar reset de senha
routes.post("/request-reset", PasswordController.requestReset);

// rota pública para redefinir a senha
routes.post("/reset-password", PasswordController.resetPassword);
routes.post("/forgot", PasswordController.requestReset);
routes.post("/reset", PasswordController.resetPassword);



/* Authenticate Routes */
routes.post("/auth/admin", Authenticate, UserController.adminUser);

routes.post("/auth/quer_divulgar", Authenticate, UserController.quer_divulgarUser);
routes.post("/auth/quer_adotar", Authenticate, UserController.quer_adotarUser);







module.exports = routes;
