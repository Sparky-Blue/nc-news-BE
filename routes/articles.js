const express = require("express");
const router = express.Router();
const { getAllArticles, changeVote } = require("../controllers/articles");
const {
  getCommentsForArticle,
  addCommentToArticle
} = require("../controllers/comments");

router.route("/").get(getAllArticles);

router
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(addCommentToArticle);

router.route("/:article_id").put(changeVote);

module.exports = router;
