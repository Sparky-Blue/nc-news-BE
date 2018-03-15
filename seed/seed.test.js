const DB_URL = "mongodb://localhost:27017/nc_news_test";
const models = require("../models/models");
const mongoose = require("mongoose");
const { Articles, Comments, Topics, Users } = require("../models/models");
const parse = require("csv-parse");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { promisify } = require("util");
const Promiseparse = promisify(parse);
const commentGenerator = require("./data/comments");

function parseCSVfile(file) {
  return fs
    .readFileAsync(file)
    .then(data => Promiseparse(data, { columns: true }))
    .then(data => data)
    .catch(err => console.log({ err }));
}

function seedTopics() {
  const file = __dirname + "/data/topics.csv";
  const ids = {};
  const topics = parseCSVfile(file).map(topic =>
    new Topics(topic).save().then(topicDoc => {
      ids[topic.slug] = topicDoc._id;
      return topicDoc;
    })
  );
  return Promise.all(topics).then(() => ids);
}

function seedUsers() {
  const file = __dirname + "/data/users.csv";
  const ids = [];
  const users = parseCSVfile(file).map(user => {
    return new Users(user).save().then(userDoc => {
      const obj = {};
      obj.id = userDoc._id;
      ids.push(obj);
      return userDoc;
    });
  });
  return Promise.all(users).then(() => ids);
}

function seedArticles(topicIds, userIds) {
  const ids = [];
  const file = __dirname + "/data/articles.csv";
  const articles = parseCSVfile(file).map(article => {
    article.belongs_to = topicIds[article.topic];
    const randomUser = Math.floor(Math.random() * userIds.length);
    article.created_by = userIds[randomUser].id;
    return new Articles(article).save().then(articleDoc => {
      ids.push(articleDoc._id);
    });
  });
  return Promise.all(articles).then(() => ids);
}

function seedComments(userIds, articleIds) {
  const commentsArr = [];
  const ids = [];
  for (let n = 100; n >= 0; n--) {
    const randomUser = Math.floor(Math.random() * userIds.length);
    const randomArticle = Math.floor(Math.random() * articleIds.length);
    const com = {
      body: commentGenerator(),
      created_by: userIds[randomUser].id,
      belongs_to: articleIds[randomArticle]
    };
    commentsArr.push(com);
  }
  const comments = commentsArr.map(comment => {
    return new Comments(comment).save().then(commentDoc => {
      ids.push(commentDoc._id);
      return commentDoc;
    });
  });
  return Promise.all(comments).then(() => ids);
}

// This should seed your development database using the CSV file data
// Feel free to use the async library, or native Promises, to handle the asynchronicity of the seeding operations.

function seedDatabase() {
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
      return seedTopics();
    })
    .then(topicIds => {
      console.log("topics collection created");
      return Promise.all([seedUsers(), topicIds]);
    })
    .then(([userIds, topicIds]) => {
      console.log("users collection created");
      return Promise.all([seedArticles(topicIds, userIds), userIds]);
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

seedDatabase();
