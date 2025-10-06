const express = require("express");
const cors = require("cors");
const path = require("path");
const server = express();

// 1️⃣ JSON
server.use(express.json());

// 2️⃣ CORS
server.use(cors({
  origin: ["https://amigopet-d0856.web.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 3️⃣ Arquivos estáticos
server.use(express.static(path.join(__dirname, "public")));

server.use(express.json());

// Rota de teste SECRET_KEY
server.get("/test-secret", (req, res) => {
  if (process.env.SECRET_KEY) {
    res.json({ message: "SECRET_KEY está definida!", secret: process.env.SECRET_KEY });
  } else {
    res.status(500).json({ message: "SECRET_KEY NÃO está definida!" });
  }
});

// Suas rotas principais
const routes = require("./Routes");
server.use(routes);

server.get("/", (req, res) => {
  res.send("🚀 AmigoPet API está rodando!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server ON! Listening on port ${PORT}`));
