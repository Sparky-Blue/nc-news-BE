const { Topics, Articles, Comments, Users } = require("../models/models");

function getAllArticles(req, res, next) {
  Articles.find()
    .populate("belongs_to", "title -_id")
    .populate({ path: "created_by", select: "username -_id" })
    .then(articles => res.send({ articles }))
    .catch(next);
}

function getCommentsForArticle(req, res, next) {
  Comments.find({ belongs_to: req.params.article_id })
    .populate("belongs_to", "title -_id")
    .populate({ path: "created_by", select: "username -_id" })
    .then(comments => res.send({ comments }))
    .catch(next);
}

function addCommentToArticle(req, res, next) {
  Users.findOne()
    .then(user => {
      const newComment = {
        body: req.body.comment,
        belongs_to: req.params.article_id,
        created_by: user._id
      };
      return new Comments(newComment)
        .save()
        .then(comment => res.status(201).send({ comment }));
    })
    .catch(next);
}

function changeVote(req, res, next) {
  if (req.query.vote === up) {
  }
  if (req.query.vote === down) {
  }
}

module.exports = {
  getAllArticles,
  getCommentsForArticle,
  addCommentToArticle,
  changeVote
};
