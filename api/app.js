const express = require("express");
const {
  getTopics,
  getArticleById,
  patchArticleVotesByArticleId,
  getUsers,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
  getEndpoints,
} = require("./controllers/controllers");
const {
  customErrorHandler,
  unhandledErrorHandler,
  pathErrorHandler,
} = require("./controllers/error-handlers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotesByArticleId);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/users", getUsers);

app.get("/api", getEndpoints);

app.use("*", pathErrorHandler);
app.use(customErrorHandler);
app.use(unhandledErrorHandler);

module.exports = app;
