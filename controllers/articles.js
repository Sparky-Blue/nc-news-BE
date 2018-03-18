const { Topics, Articles, Comments, Users } = require("../models/models");
const { changeVote } = require("./utils");

function getAllArticles(req, res, next) {
  Articles.find()
    .populate("belongs_to", "title -_id")
    .populate("created_by", "username -_id")
    .then(articles => res.send({ articles }))
    .catch(next);
}

function addArticleVote(req, res, next) {
  const { vote } = req.query;
  if (vote === "up" || vote === "down") {
    return changeVote(Articles, req.params.article_id, vote)
      .then(article => res.status(200).send({ article }))
      .catch(next);
  } else return next({ msg: "please vote up or down" });
}

function getArticlesByTopicId(req, res, next) {
  return Articles.find({ belongs_to: req.params.topic_id })
    .populate("belongs_to", "title -_id")
    .populate("created_by", "username -_id")
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
}

function getArticlesByTopic(req, res, next) {
  return Topics.findOne({ slug: req.params.topic })
    .then(topic => {
      return Articles.find({ belongs_to: topic._id })
        .populate("belongs_to", "title -_id")
        .populate("created_by", "username -_id");
    })
    .then(articles => res.send({ articles }))
    .catch(err => {
      next({ status: 400 });
    });
}

module.exports = {
  getAllArticles,
  addArticleVote,
  getArticlesByTopicId,
  getArticlesByTopic
};
