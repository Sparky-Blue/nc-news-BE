const { Comments, Users, Topics } = require("../models/models");
const { changeVote } = require("./utils");

function getCommentsForArticle(req, res, next) {
  return Comments.find({ belongs_to: req.params.article_id })
    .populate("belongs_to", "title -_id")
    .populate({ path: "created_by", select: "username -_id" })
    .then(comments => res.send({ comments }))
    .catch(next);
}

function addCommentToArticle(req, res, next) {
  if (!req.query.username)
    return next({ status: 400, msg: "please enter a valid username" });
  else {
    return Users.findOne({ username: req.query.username })
      .then(user => {
        const newComment = {
          body: req.body.comment,
          belongs_to: req.params.article_id,
          created_by: user._id
        };
        return new Comments(newComment).save();
      })
      .then(comment => {
        res.status(201).send({ comment });
      })
      .catch(next);
  }
}

function deleteComment(req, res, next) {
  return Comments.deleteOne({ _id: req.params.comments_id })
    .then(deleteResult => res.send({ deleteResult }))
    .catch(next);
}

function addCommentVote(req, res, next) {
  const { vote } = req.query;
  if (vote === "up" || vote === "down") {
    return changeVote(Comments, req.params.comments_id, vote)
      .then(comment => res.status(200).send({ comment }))
      .catch(next);
  } else return next({ msg: "please vote up or down" });
}

function findCommentById(req, res, next) {
  return Comments.findById(req.params.comments_id)
    .then(comment => {
      res.send({ comment });
    })
    .catch(next);
}

module.exports = {
  deleteComment,
  getCommentsForArticle,
  addCommentToArticle,
  findCommentById,
  addCommentVote
};
