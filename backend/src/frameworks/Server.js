const express = require("express");
const cors = require("cors");
const routes = require("./Routes");

const server = express();

// Render fornece a porta pelo environment variable PORT
const PORT = process.env.PORT || 3000; // 4000 só se estiver rodando localmente

// ✅ Configura o CORS para aceitar apenas seu front-end
server.use(cors({
  origin: ["https://amigopet-d0856.web.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

server.use(express.json()); // Essencial para req.body funcionar
server.use(routes);

server.get("/", (req, res) => {
  res.send("🚀 AmigoPet API está rodando!");
});

server.listen(PORT, () => {
  console.log(`Server ON! Listening on port ${PORT}`);
});




