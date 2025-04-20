const { poolPromise, sql } = require("../config/db"); // Import the database config

// Get all FAQs from the database
async function getAllFAQs() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM FAQs");

    return result.recordset; // Returns an array of FAQs
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw new Error("Error fetching FAQs");
  }
}

// Add a new FAQ to the database
async function addFAQ(question, answer) {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("question", sql.NVarChar, question)
      .input("answer", sql.NVarChar, answer)
      .query("INSERT INTO FAQs (question, answer) VALUES (@question, @answer)");
  } catch (error) {
    console.error("Error adding FAQ:", error);
    throw new Error("Error adding FAQ");
  }
}

module.exports = {
  getAllFAQs,
  addFAQ
};
