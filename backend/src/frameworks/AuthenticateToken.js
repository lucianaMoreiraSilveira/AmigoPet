// Authenticate.js
const jwt = require("jsonwebtoken");

function Authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Cabeçalho Authorization malformado ou ausente." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // adiciona os dados do usuário na requisição
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido", message: error.message });
    } else {
      return res.status(500).json({ error: "Erro interno", message: error.message });
    }
  }
}

module.exports = Authenticate;
