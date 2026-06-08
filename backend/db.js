const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "puck",
  password: "", // usually empty on local Postgres.app
  port: 5432,
});

module.exports = pool;