const { fetchUsers, fetchUsersByUserId } = require('../models/user-model.js')


exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByUserId = (req, res, next) => {
  const { username } = req.params;
  fetchUsersByUserId(username).then((user) => {
    res.status(200).send({ user: user });
  });
};
