const {
  deleteCommentByCommentId, patchCommentByCommentId,
} = require("../controllers/comment-controller");

const commentRouter = require("express").Router();

commentRouter
    .route("/:comment_id")
    .delete(deleteCommentByCommentId)
    .patch(patchCommentByCommentId);

module.exports = commentRouter;
