const { Topics } = require("../models/models");

function getAllTopics(req, res, next) {
  Topics.find().then(topics => res.send({ topics }));
}

module.exports = { getAllTopics };
