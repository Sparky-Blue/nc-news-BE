const { Topics, Articles, Comments, Users } = require("../models/models");
const { changeVote } = require("./utils");

function getAllArticles(req, res, next) {
  return Articles.find()
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

function getArticlesWithCommentsTotal(req, res, next) {
  return Articles.aggregate([
    {
      $lookup: {
        from: "comments",
        foreignField: "belongs_to",
        localField: "_id",
        as: "comments"
      }
    },
    { $addFields: { comments: { $size: "$comments" } } },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "created_by",
        as: "created_by"
      }
    },
    {
      $lookup: {
        from: "topics",
        foreignField: "_id",
        localField: "belongs_to",
        as: "belongs_to"
      }
    },

    {
      $addFields: {
        created_by: { $arrayElemAt: ["$created_by.username", 0] }
      }
    },
    {
      $addFields: {
        belongs_to: { $arrayElemAt: ["$belongs_to.title", 0] }
      }
    }
  ])
    .then(articles => res.send({ articles }))
    .catch(next);
}

module.exports = {
  getAllArticles,
  addArticleVote,
  getArticlesByTopicId,
  getArticlesByTopic,
  getArticlesWithCommentsTotal
};
