process.env.NODE_ENV = process.env.NODE_ENV || "test";
const DB =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : require("../config/index").DB_URL[process.env.NODE_ENV];
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
      return mongoose.connection.db.dropDatabase();
    })
    .then(() => {
      return seedTopics("seed/testData/topics_test.csv");
    })
    .then(topicIds => {
      return Promise.all([seedUsers("seed/testData/users_test.csv"), topicIds]);
    })
    .then(([userIds, topicIds]) => {
      return Promise.all([
        seedArticles("seed/testData/articles_test.csv", topicIds, userIds),
        userIds,
        topicIds
      ]);
    })
    .then(([articleIds, userIds, topicIds]) => {
      return Promise.all([
        articleIds,
        userIds,
        topicIds,
        seedComments(userIds, articleIds, 20)
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

module.exports = seedTestDatabase;
