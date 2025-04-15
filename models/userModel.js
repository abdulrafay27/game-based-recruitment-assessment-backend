const { poolPromise } = require("../config/db");

const getUserByEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("email", email)
    .query("SELECT * FROM Users WHERE email = @email");
  return result.recordset[0];
};

const createUser = async (name, email, hashedPassword) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("name", name)
    .input("email", email)
    .input("password", hashedPassword)
    .query(
      "INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)"
    );
};

module.exports = {
  getUserByEmail,
  createUser,
};
