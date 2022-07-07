const {
  retireCommentByCommentId,
  updateCommentByCommentId,
} = require("../models/comment-model");

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  retireCommentByCommentId(comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentByCommentId(comment_id, inc_votes)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};
