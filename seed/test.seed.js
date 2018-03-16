process.env.NODE_ENV = process.env.NODE_ENV || "test";
const DB = require("../config/index").DB_URL[process.env.NODE_ENV];
const mongoose = require("mongoose");
const {
  seedArticles,
  seedComments,
  seedTopics,
  seedUsers
} = require("./utils");

function seedTestDatabase(DB_URL) {
  return mongoose
    .connect(DB_URL, { useMongoClient: true })
    .then(() => {
      console.log(`Connected to ${DB_URL}`);
      return mongoose.connection.db.dropDatabase();
    })
    .then(() => {
      console.log("collections dropped");
      return seedTopics("seed/testData/topics_test.csv");
    })
    .then(topicIds => {
      console.log("topics collection created");
      return Promise.all([seedUsers("seed/testData/users_test.csv"), topicIds]);
    })
    .then(([userIds, topicIds]) => {
      console.log("users collection created");
      return Promise.all([
        seedArticles("seed/testData/articles_test.csv", topicIds, userIds),
        userIds,
        topicIds
      ]);
    })
    .then(([articleIds, userIds, topicIds]) => {
      console.log("articles collection created");
      return Promise.all([
        articleIds,
        userIds,
        topicIds,
        seedComments(userIds, articleIds)
      ]);
    })
    .then(([articleIds, userIds, topicIds, commentIds]) => {
      return Promise.all([articleIds, userIds, topicIds, commentIds]);
    })
    .catch(err => {
      if (err.code === 26) console.log("collection does not exist");
      console.log({ err });
    });
}

// seedTestDatabase(DB);

module.exports = seedTestDatabase;