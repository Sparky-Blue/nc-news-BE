const { Users } = require("../models/models");

function getUsersData(req, res, next) {
  return Users.findOne({ username: req.params.username })
    .then(user => res.send({ user }))
    .catch(next);
}

module.exports = { getUsersData };
