const endpoints = require("../../endpoints.json");

exports.fetchEndpoints = async () => {
  try {
    const returnedEndPoints = await endpoints;
    return returnedEndPoints;
  } catch (err) {
    throw err;
  }
};
