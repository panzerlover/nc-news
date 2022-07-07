const { getTopics } = require('../controllers/topic-contoller.js');


const topicRouter = require('express').Router();

topicRouter
    .route('/')
    .get(getTopics)

module.exports = topicRouter;