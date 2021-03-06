const db = require("../../db/connection");
const CustomError = require("../utils/class-custom-error");
const { checkExists } = require("../utils/utils.js");

exports.retireCommentByCommentId = async (id) => {
  try {
    const values = [id];
    const queryStr = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
    const data = await db.query(queryStr, values);

    if (!data.rows.length) {
      await checkExists("comments", "comment_id", id);
    }
  } catch (err) {
    throw new CustomError(500, null, null, err);
  }
};

exports.updateCommentByCommentId = async (id, votes) => {
  
  try {
    const values = [id, votes];
    const queryStr = `
    UPDATE comments 
    SET votes = votes + $2 
    WHERE comment_id = $1 
    RETURNING *;
    `
    const data = await db.query(queryStr, values)

    if (!data.rows.length) {
      await checkExists("comments", "comment_id", id);
    }

    return data.rows[0];
    
  } catch (err) {

    throw new CustomError(500, null, null, err)
    
  }

}