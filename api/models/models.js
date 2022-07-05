const db = require("../../db/connection.js");
const CustomError = require("../utils/class-custom-error.js");
const ERR_MSGS = require("../utils/enum-errors");

exports.fetchTopics = async () => {
  try {
    const text = `SELECT * FROM topics`;
    const data = await db.query(text);
    return data.rows;
  } catch (err) {
    throw new CustomError(500, ERR_MSGS.DEFAULT_W_SOURCE("GET topics"), err);
  }
};

exports.fetchArticleById = async (id) => {
  try {
    const text = `SELECT * FROM articles WHERE article_id = $1`;
    const data = await db.query(text, [id]);
    return data.rows[0];
  } catch (err) {
    throw new CustomError(500, ERR_MSGS.DEFAULT_W_SOURCE("GET articles"), err);
  }
};
