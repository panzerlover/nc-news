const format = require("pg-format");
const db = require("../../db/connection");
const CustomError = require("./class-custom-error");
const ERR_MSGS = require("./enum-errors");

exports.checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1", table, column);
  const data = await db.query(queryStr, [value]);
  if (data.rows.length === 0) {
    const { msg, tip, status } = ERR_MSGS.DOES_NOT_EXIST;
    throw new CustomError(status, msg, tip, {});
  }
};