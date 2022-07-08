const { fetchTopics, addTopic } = require("../models/topic-model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  addTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic: topic });
    })
    .catch((err) => {
      next(err);
    });
};
