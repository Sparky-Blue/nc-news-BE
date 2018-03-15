const express = require("express");
const router = express.Router();
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const usersRouter = require("./users");
const { getEndPointDocumentation } = require("../controllers/api");

router.route("/").get(getEndPointDocumentation);
router.use("/topics", topicsRouter);
router.use("/articles", articlesRouter);
router.use("/comments", commentsRouter);
router.use("/users", usersRouter);

module.exports = router;
