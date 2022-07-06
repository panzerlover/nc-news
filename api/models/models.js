const db = require("../../db/connection.js");
const CustomError = require("../utils/class-custom-error.js");
const ERR_MSGS = require("../utils/enum-errors");
const format = require("pg-format");

exports.fetchTopics = async () => {
  try {
    const queryStr = `SELECT * FROM topics`;
    const data = await db.query(queryStr);
    return data.rows;
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};

exports.fetchArticles = async () => {
  try {
    const queryStr = `
    SELECT articles.*, 
    CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN comments USING (article_id)
    GROUP BY article_id
    ORDER BY articles.created_at DESC;
    `;
    const data = await db.query(queryStr);
    return data.rows; 

  } catch (err) {
    throw new CustomError(500, null, null, err);
  }

}

exports.fetchArticleById = async (id) => {
  try {
    const queryStr = `SELECT articles.*, CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN comments USING (article_id)
    WHERE article_id = $1
    GROUP BY article_id;`;
    const data = await db.query(queryStr, [id]);
    if (!data.rows.length) {
      await checkExists("articles", "article_id", id, "article");
    }

    return data.rows[0];
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(400, null, null, err);
  }
};

exports.updateArticleVotesById = async (id, votes) => {
  try {
    const queryStr = `UPDATE articles 
        SET votes = votes + $2 
        WHERE article_id = $1
        RETURNING *;`;
    const data = await db.query(queryStr, [id, votes]);

    if (!data.rows.length) {
      await checkExists("articles", "article_id", id, "article");
    }

    return data.rows[0];
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(400, null, null, err);
  }
};

exports.fetchUsers = async () => {
  try {
    const queryStr = `SELECT * FROM users;`;
    const data = await db.query(queryStr);
    return data.rows;
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};

const checkExists = async (table, column, value, label) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1", table, column);
  const data = await db.query(queryStr, [value]);
  if (data.rows.length === 0) {
    const { msg, tip } = ERR_MSGS.DOES_NOT_EXIST(value, label);
    throw new CustomError(404, msg, tip, {});
  }
};