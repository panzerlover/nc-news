const express = require("express");
const {
  customErrorHandler,
  unhandledErrorHandler,
  pathErrorHandler,
} = require("./controllers/error-handlers");
const apiRouter = require("./routes/api-router.js");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter)

app.use("*", pathErrorHandler);
app.use(customErrorHandler);
app.use(unhandledErrorHandler);

module.exports = app;
