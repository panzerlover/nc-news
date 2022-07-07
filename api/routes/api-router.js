const { getEndpoints } = require('../controllers/controllers');
const articleRouter = require('./article-router');
const commentRouter = require('./comment-router');
const topicRouter = require('./topic-router');
const userRouter = require('./user-router');

const apiRouter = require('express').Router();

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/users', userRouter);

apiRouter.get('/', getEndpoints)

module.exports = apiRouter;