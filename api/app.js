const express = require("express");
const { getTopics } = require("./controllers/controllers");
const {
  customErrorHandler,
  unhandledErrorHandler,
  pathErrorHandler,
} = require("./controllers/error-handlers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use("*", pathErrorHandler);
app.use(customErrorHandler);
app.use(unhandledErrorHandler);

module.exports = app;
