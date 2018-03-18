const express = require("express");
const router = express.Router();
const { getAllArticles, addArticleVote } = require("../controllers/articles");
const {
  getCommentsForArticle,
  addCommentToArticle
} = require("../controllers/comments");

router.route("/").get(getAllArticles);

router
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(addCommentToArticle);

router.route("/:article_id").put(addArticleVote);

module.exports = router;
