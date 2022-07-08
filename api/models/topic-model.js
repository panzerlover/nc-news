const db = require("../../db/connection.js");
const CustomError = require("../utils/class-custom-error.js");
const ERR_MSGS = require("../utils/enum-errors.js");

exports.fetchTopics = async () => {
  try {
    const queryStr = `SELECT * FROM topics`;
    const data = await db.query(queryStr);
    return data.rows;
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};
exports.addTopic = async (slug, description) => {
  try {
    const values = [slug, description];
    const queryStr = `
    INSERT INTO topics
    (slug, description)
    VALUES
    ($1, $2)
    RETURNING *
    `;
    const data = await (await db.query(queryStr, values)).rows[0];

    return data;
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};
