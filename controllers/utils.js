const { Comments, Users, Topics } = require("../models/models");

function changeVote(collection, id, query) {
  const vote = query === "up" ? 1 : -1;
  return collection.findOneAndUpdate(
    { _id: id },
    { $inc: { votes: vote } },
    { new: true }
  );
}

module.exports = { changeVote };
