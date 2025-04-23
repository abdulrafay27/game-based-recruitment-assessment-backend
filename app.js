require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const routes = require("./routes"); // This imports the routes from the routes directory

const app = express();
app.disable("x-powered-by");
// Middleware setup
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Middleware to parse JSON request bodies

// Routes setup
app.use("/api", routes); // Prefix all routes with /api

// Initialize the database connection
require("./config/db"); // This triggers the DB connection to Azure SQL

// Start the server on a specified port
const PORT = process.env.PORT || 5000; // Default port to 5000 if not set
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
