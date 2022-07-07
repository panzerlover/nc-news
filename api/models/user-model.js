const db = require("../../db/connection.js");
const CustomError = require("../utils/class-custom-error.js");
const { checkExists } = require("../utils/utils.js");

exports.fetchUsers = async () => {
  try {
    const queryStr = `SELECT * FROM users;`;
    const data = await db.query(queryStr);
    return data.rows;
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};

exports.fetchUsersByUsername = async (username) => {
  try {
    const values = [username];
    const queryStr = `
    SELECT * FROM users
    WHERE username = $1
    `;
    const data = await db.query(queryStr, values);

    if (!data.rows.length) {
      await checkExists("users", "username", username);
    }
    
    return data.rows[0];
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};
