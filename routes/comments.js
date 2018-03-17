const express = require("express");
const router = express.Router();
const { deleteComment, findCommentById } = require("../controllers/comments");

router
  .route("/:comments_id")
  .delete(deleteComment)
  .get(findCommentById);

module.exports = router;
