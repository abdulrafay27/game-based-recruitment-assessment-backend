const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // Keep this false for production
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log(" Connected to Azure SQL Database!");
    return pool;
  })
  .catch((err) => {
    console.error(" Database connection failed:", err.message);
    process.exit(1);
  });

module.exports = {
  sql,
  poolPromise,
};

console.log("DB_SERVER from env:", process.env.DB_SERVER);
