const express = require("express");
const router = express.Router();
const { getAllTopics } = require("../controllers/topics");
const {
  getArticlesByTopicId,
  getArticlesByTopic
} = require("../controllers/articles");

router.route("/").get(getAllTopics);

router.route("/articles/:topic").get(getArticlesByTopic);

router.route("/:topic_id/articles").get(getArticlesByTopicId);

module.exports = router;
