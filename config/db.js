const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection URI (assuming you're using MongoDB Atlas)
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
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
