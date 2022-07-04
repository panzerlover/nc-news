const db = require("../../db/connection.js");
const CustomError = require("../utils/class-custom-error.js");

exports.fetchTopics = async () => {
  const text = `SELECT * FROM topics`;
  const data = await db.query(text);
  if (data.rows.length === 0) {
    throw new CustomError(400, "Returned length was zero", {
      location: "models/fetchTopics",
      details: "returned a table length of zero when selecting all from topics."
    });
  } else {
    return data.rows;
  }
};
