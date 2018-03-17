const { Topics, Articles, Comments, Users } = require("../models/models");

function getAllArticles(req, res, next) {
  Articles.find()
    .populate("belongs_to", "title -_id")
    .populate({ path: "created_by", select: "username -_id" })
    .then(articles => res.send({ articles }))
    .catch(next);
}

function changeVote(req, res, next) {
  const { article_id } = req.params;
  const vote = req.query.vote === "up" ? 1 : -1;
  return Articles.findOneAndUpdate(
    { _id: article_id },
    { $inc: { votes: vote } }
  )
    .then(article => res.status(200).send({ article }))
    .catch(next);
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
    .then(article => res.send({ article }))
    .catch(err => {
      next({ status: 400 });
    });
}

module.exports = {
  getAllArticles,
  changeVote,
  getArticlesByTopicId,
  getArticlesByTopic
};
