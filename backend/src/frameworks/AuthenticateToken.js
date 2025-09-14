const jwt = require("jsonwebtoken");

function Authenticate(request, reply, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Cabeçalho Authorization malformado ou ausente." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    request.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return reply.code(401).send({ error: "Token expirado" });
    } else if (error.name === "JsonWebTokenError") {
      return reply.code(401).send({ error: "Token inválido", message: error.message });
    } else {
      return reply.code(500).send({ error: "Erro interno", message: error.message });
    }
  }
}

module.exports = Authenticate;
