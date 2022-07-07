const { getUsers, getUsersByUsername } = require('../controllers/user-controller');

const userRouter = require('express').Router();

userRouter
    .route('/')
    .get(getUsers)

userRouter
    .route('/:username')
    .get(getUsersByUsername)

module.exports = userRouter;