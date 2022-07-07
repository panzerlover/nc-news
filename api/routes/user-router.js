const { getUsers } = require('../controllers/controllers');

const userRouter = require('express').Router();

userRouter
    .route('/')
    .get(getUsers)

module.exports = userRouter;