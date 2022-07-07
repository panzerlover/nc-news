const { retireCommentByCommentId } = require("../models/comment-model");

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
