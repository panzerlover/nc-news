const db = require('../../db/connection.js');
const CustomError = require('../utils/class-custom-error.js');
const ERR_MSGS = require('../utils/enum-errors');
const format = require('pg-format');

exports.fetchTopics = async () => {
  try {
    const queryStr = `SELECT * FROM topics`;
    const data = await db.query(queryStr);
    return data.rows;
  } catch (err) {
    throw new CustomError(500, ERR_MSGS.DEFAULT_W_SOURCE('GET topics'), err);
  }
};

exports.fetchArticleById = async (id) => {
  try {
    const queryStr = `SELECT * FROM articles WHERE article_id = $1`;
    const data = await db.query(queryStr, [id]);

    if (!data.rows.length) {
      await this.checkExists('articles', 'article_id', id)
    }

    return data.rows[0];
  } catch (err) {

    if (err instanceof CustomError) throw err;
    throw new CustomError(400, ERR_MSGS.DEFAULT_W_SOURCE('GET articles'), err);
  }
};

exports.updateArticleVotesById = async (id, votes) => {
    try {
        const queryStr = `UPDATE articles 
        SET votes = votes + $2 
        WHERE article_id = $1
        RETURNING *;`;
        const data = await db.query(queryStr, [id, votes])

        if (!data.rows.length) {
          await this.checkExists('articles', 'article_id', id)
        }

        return data.rows[0];
    } catch (err) {
        if (err instanceof CustomError) throw err;
        throw new CustomError(400, ERR_MSGS.DEFAULT_W_SOURCE('PATCH articles'), err)
    }
}

exports.checkExists = async (table, column, value) => {
  
  const queryStr = format('SELECT * FROM %I WHERE %I = $1', table, column);
  const data = await db.query(queryStr, [value]);
  if (data.rows.length === 0) {
    throw new CustomError(404, ERR_MSGS.DOES_NOT_EXIST(value, column), {});
  }

}