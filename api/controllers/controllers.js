const {
  fetchTopics,
  fetchArticleById,
  updateArticleVotesById,
  fetchUsers,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((article) => {
      res.status(200).send({ articles: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(201).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) =>{
    const {article_id} = req.params;
    const {username, body} = req.body;
    addCommentByArticleId(article_id, username, body).then((comment) => {
        res.status(201).send({comment: comment})
    }).catch((err)=>{
        next(err)
    })
}