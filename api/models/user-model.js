const db = require("../../db/connection.js");
const CustomError = require("../utils/class-custom-error.js");

exports.fetchUsers = async () => {
    try {
      const queryStr = `SELECT * FROM users;`;
      const data = await db.query(queryStr);
      return data.rows;
    } catch (err) {
      throw new CustomError(500, null, null, err);
    }
  };

exports.fetchUsersByUserId = async (id) =>{

}