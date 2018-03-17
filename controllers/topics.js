const { Topics, Articles } = require("../models/models");

function getAllTopics(req, res, next) {
  Topics.find()
    .then(topics => res.send({ topics }))
    .catch(next);
}

module.exports = { getAllTopics };
