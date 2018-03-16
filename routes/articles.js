const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getCommentsForArticle,
  addCommentToArticle,
  changeVote
} = require("../controllers/articles");

router.route("/").get(getAllArticles);

router
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(addCommentToArticle);

router.route("/:article_id").put(changeVote);

module.exports = router;
