const { fetchTopics } = require("../models/topic-model");

exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topics) => {
        res.status(200).send({topics: topics});
      })
      .catch((err) => {
        next(err);
      });
};