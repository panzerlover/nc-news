const { fetchEndpoints } = require("../models/endpoint-model");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints: endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
