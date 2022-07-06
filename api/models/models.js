const db = require("../../db/connection.js");
const CustomError = require("../utils/class-custom-error.js");
const ERR_MSGS = require("../utils/enum-errors");
const format = require("pg-format");
const {
  isValidArticleColumn,
  isValidOrder,
} = require("../utils/input-validators.js");
const endpoints = require("../../endpoints.json");

exports.fetchTopics = async () => {
  try {
    const queryStr = `SELECT * FROM topics`;
    const data = await db.query(queryStr);
    return data.rows;
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};

exports.fetchArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  try {
    let values = [];
    let queryStr = `
    SELECT articles.*, 
    CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN comments USING (article_id) 
    `;
    if (topic !== undefined) {
      queryStr += `
      WHERE topic = $1 
      `;
      values.push(topic);
    }
    queryStr += `
    GROUP BY article_id
    `;
    if (isValidArticleColumn(sort_by) && isValidOrder(order)) {
      queryStr += ` ORDER BY articles.${sort_by} ${order};`;
    } else {
      const { status, tip, msg } = ERR_MSGS.INVALID_QUERY;
      throw new CustomError(status, msg, tip, {});
    }
    const data = await db.query(queryStr, values);

    if (!data.rows.length) {
      await checkExists("articles", "topic", topic);
    }

    return data.rows;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(500, null, null, err);
  }
};

exports.fetchArticleById = async (id) => {
  try {
    const queryStr = `SELECT articles.*, CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN comments USING (article_id)
    WHERE article_id = $1
    GROUP BY article_id;`;
    const data = await db.query(queryStr, [id]);
    if (!data.rows.length) {
      await checkExists("articles", "article_id", id);
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
      await checkExists("articles", "article_id", id);
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

exports.fetchCommentsByArticleId = async (id) => {
  try {
    const queryStr = `
    SELECT * FROM comments
    WHERE article_id = $1
    ;`;
    const data = await db.query(queryStr, [id]);

    if (!data.rows.length) {
      await checkExists("articles", "article_id", id);
    }

    return data.rows;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(400, null, null, err);
  }
};

exports.addCommentByArticleId = async (id, username, body) => {
  try {
    const queryStr = `
   INSERT INTO comments (article_id, author, body, votes)
   VALUES ($1, $2, $3, 0)
   RETURNING *;
   `;
    const data = await db.query(queryStr, [id, username, body]);

    return data.rows[0];
  } catch (err) {
    if (err.code === "23503") {
      await checkExists("users", "username", username);
      await checkExists("articles", "article_id", id);
    }
    throw new CustomError(500, null, null, err);
  }
};

exports.retireCommentByCommentId = async (id) => {
  try {
    const values = [id];
    const queryStr = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
    const data = await db.query(queryStr, values);

    if (!data.rows.length) {
      await checkExists("comments", "comment_id", id);
    }
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(500, null, null, err);
  }
};
exports.fetchEndpoints = async () => {
  try {
    const returnedEndPoints = await endpoints;
    return returnedEndPoints;
  } catch (err) {
    throw err;
  }

};

const checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1", table, column);
  const data = await db.query(queryStr, [value]);
  if (data.rows.length === 0) {
    const { msg, tip, status } = ERR_MSGS.DOES_NOT_EXIST;
    throw new CustomError(status, msg, tip, {});
  }
};
