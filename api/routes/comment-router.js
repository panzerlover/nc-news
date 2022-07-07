const { deleteCommentByCommentId } = require('../controllers/controllers');

const commentRouter = require('express').Router();

commentRouter
    .route('/:comment_id')
    .delete(deleteCommentByCommentId)


module.exports = commentRouter