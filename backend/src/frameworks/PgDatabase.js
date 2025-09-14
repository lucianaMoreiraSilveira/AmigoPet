const { Pool } = require("pg");
const env = require("dotenv");

/* Carrega as variaveis do .env para 
variaveis de ambiente gerenciada pelo SO */
env.config();

const database = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = database;
