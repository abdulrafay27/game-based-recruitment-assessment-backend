require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const router = require("./routes/index");

app.use(express.json());
app.use("/api", router);
const pool = require("./config/db"); // This triggers the connection to Azure SQL

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
