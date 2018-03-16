const { Topics, Articles } = require("../models/models");

function getAllTopics(req, res, next) {
  Topics.find().then(topics => res.send({ topics }));
}

function getArticlesByTopic(req, res, next) {
  Topics.findOne({ slug: req.params.topic })
    .then(data =>
      Articles.find({ belongs_to: data._id })
        .populate("belongs_to", "title -_id")
        .populate("created_by", "username -_id")
    )
    .then(articles => res.send({ articles }))
    .catch(err => console.log(err));
}

module.exports = { getAllTopics, getArticlesByTopic };
