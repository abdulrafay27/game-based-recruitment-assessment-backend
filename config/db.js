
const sql = require("mssql");
require("dotenv").config();  // Load environment variables from .env file

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,  // This should be your server name (e.g., fypassessment.database.windows.net)
  database: process.env.DB_DATABASE,  // Ensure this is the correct DB variable
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // Keep this false for production
  },
};

// Log DB_SERVER value to check if it's being loaded correctly
console.log("DB_SERVER from env:", process.env.DB_SERVER);

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to Azure SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);  // Exit the process on failure
  });

const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection URI (assuming you're using MongoDB Atlas)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

// Connect to MongoDB using Mongoose
const mongo = async () => {
  console.log("Attempting to connect to MongoDB..."); // Log before attempting to connect

  try {
    // Use .then() to log success
    await mongoose
      .connect(uri)
      .then(() => {
        console.log("Successfully connected to MongoDB Atlas"); // Log on successful connection
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit on error
      });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the process if connection fails
  }
};


module.exports = {
  mongo,
};



console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

