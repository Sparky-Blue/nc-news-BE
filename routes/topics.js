const express = require("express");
const router = express.Router();
const { getAllTopics, getArticlesByTopic } = require("../controllers/topics");

router.route("/").get(getAllTopics);

router.route("/:topic/articles").get(getArticlesByTopic);

module.exports = router;
