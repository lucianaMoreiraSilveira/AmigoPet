const express = require("express");
const cors = require("cors");
const routes = require("./Routes");

const server = express();

// Render fornece a porta pelo environment variable PORT
const PORT = process.env.PORT || 4000; // 4000 só se estiver rodando localmente

server.use(cors());
server.use(express.json()); // Essencial para req.body funcionar
server.use(routes);

server.get("/", (req, res) => {
  res.send("🚀 AmigoPet API está rodando!");
});

server.listen(PORT, () => {
  console.log(`Server ON! Listening on port ${PORT}`);
});




