const { getTopics, postTopic } = require('../controllers/topic-contoller.js');


const topicRouter = require('express').Router();

topicRouter
    .route('/')
    .get(getTopics)
    .post(postTopic)

module.exports = topicRouter;