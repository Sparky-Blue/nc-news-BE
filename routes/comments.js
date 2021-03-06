const express = require("express");
const router = express.Router();
const {
  deleteComment,
  findCommentById,
  addCommentVote
} = require("../controllers/comments");

router
  .route("/:comment_id")
  .delete(deleteComment)
  .get(findCommentById)
  .put(addCommentVote);

module.exports = router;
