process.env.NODE_ENV = process.env.NODE_ENV || "development";
const DB = require("../config/index").DB_URL[process.env.NODE_ENV];
const mongoose = require("mongoose");
const {
  seedArticles,
  seedComments,
  seedTopics,
  seedUsers
} = require("./utils");

function seedDatabase(DB_URL) {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Connected to mongoDB");
      return mongoose.connection.db.dropDatabase();
    })
    .catch(err => {
      if (err.code === 26) console.log("collection does not exist");
    })
    .then(() => {
      return seedTopics("seed/data/topics.csv");
    })
    .then(topicIds => {
      console.log("topics collection created");
      return Promise.all([seedUsers("seed/data/users.csv"), topicIds]);
    })
    .then(([userIds, topicIds]) => {
      console.log("users collection created");
      return Promise.all([
        seedArticles("seed/data/articles.csv", topicIds, userIds),
        userIds
      ]);
    })
    .then(([articleIds, userIds]) => {
      console.log("articles collection created");
      return seedComments(userIds, articleIds);
    })
    .then(commentIds => {
      console.log("comments collection created");
    })
    .then(() => {
      mongoose.disconnect();
      console.log("disconnected");
    })
    .catch(err => console.log({ err }));
}

seedDatabase(DB);
