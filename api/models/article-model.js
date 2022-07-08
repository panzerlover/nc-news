const db = require("../../db/connection.js");
const CustomError = require("../utils/class-custom-error.js");
const ERR_MSGS = require("../utils/enum-errors");
const {
  isValidArticleColumn,
  isValidOrder,
} = require("../utils/input-validators.js");
const { checkExists } = require("../utils/utils.js");

exports.fetchArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 1
) => {
  try {

    limit = parseInt(limit);
    p = parseInt(p);
    let values = [];
    let queryStr = `
    SELECT 
    articles.*, 
    CAST(COUNT(comment_id) AS INTEGER) AS comment_count
    FROM articles 
    LEFT JOIN comments USING (article_id) 
    `;
    if (topic !== undefined) {
      values.push(topic);
      queryStr += `WHERE topic = $${values.length} `;
    }
    queryStr += ` GROUP BY article_id`;
    if (isValidArticleColumn(sort_by) && isValidOrder(order)) {
      queryStr += ` ORDER BY articles.${sort_by} ${order}`;
    } else {
      const { status, tip, msg } = ERR_MSGS.INVALID_QUERY;
      throw new CustomError(status, msg, tip, {});
    }

    const data = {};
    data.total_count = await (await db.query(queryStr, values)).rows.length;

    const offset = (p - 1) * limit;
    values.push(limit, offset);
    queryStr += ` LIMIT $${values.length - 1} OFFSET $${values.length}`;

    data.articles = await (await db.query(queryStr, values)).rows;
    if (!data.articles.length) {
      await checkExists("articles", "topic", topic);
    }
    data.page = p;
    data.displaying = `showing results ${offset + 1} to ${offset + limit}`;
    return data;
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};

exports.addArticle = async (author, title, body, topic) => {
  try {
    const values = [author, title, body, topic];
    const queryStr = `
    INSERT INTO articles
    (author, title, body, topic)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
    ;`;
    const data = await db.query(queryStr, values);

    return data.rows[0];
  } catch (err) {
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
    throw new CustomError(400, null, null, err);
  }
};

exports.updateArticleVotesById = async (id, votes) => {
  try {
    const queryStr = `
    UPDATE articles 
    SET votes = votes + $2 
    WHERE article_id = $1
    RETURNING *;
    `;
    const data = await db.query(queryStr, [id, votes]);

    if (!data.rows.length) {
      await checkExists("articles", "article_id", id);
    }

    return data.rows[0];
  } catch (err) {
    throw new CustomError(400, null, null, err);
  }
};

exports.fetchCommentsByArticleId = async (id, limit = 10, p = 1) => {
  try {
    limit = parseInt(limit);
    p = parseInt(p);
    const data = {};
    const values = [id];
    let queryStr = `
    SELECT * FROM comments
    WHERE article_id = $1
    `;
    data.total_count = await (await db.query(queryStr, values)).rows.length;

    queryStr += ` LIMIT $2 OFFSET $3`;

    const offset = (p - 1) * limit;
    values.push(limit, offset);

    data.comments = await (await db.query(queryStr, values)).rows;
    data.displaying = `showing results ${offset + 1} to ${offset + limit}`;
    data.page = p;

    if (!data.comments.length) {
      await checkExists("articles", "article_id", id);
    }

    return data;
  } catch (err) {
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
