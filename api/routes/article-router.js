const {
  getArticles,
  getArticleById,
  patchArticleVotesByArticleId,
  getCommentsByArticleId,
  postCommentByArticleId,
  postArticle,
} = require("../controllers/article-controller");

const articleRouter = require("express").Router();

articleRouter
  .route("/")
  .get(getArticles)
  .post(postArticle);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotesByArticleId);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articleRouter;
