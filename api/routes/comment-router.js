const {
  deleteCommentByCommentId,
} = require("../controllers/comment-controller");

const commentRouter = require("express").Router();

commentRouter
    .route("/:comment_id")
    .delete(deleteCommentByCommentId);

module.exports = commentRouter;
