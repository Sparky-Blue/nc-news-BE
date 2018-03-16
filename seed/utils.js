const faker = require("faker");
const { Articles, Comments, Topics, Users } = require("../models/models");
const parse = require("csv-parse");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { promisify } = require("util");
const Promiseparse = promisify(parse);

function generateComments() {
  return faker.hacker.phrase();
}

// function parseCSVfile(file) {
//   return fs
//     .readFileAsync(file)
//     .then(data => Promiseparse(data, { columns: true }))
//     .then(data => data)
//     .catch(err => console.log({ err }));
// }

function parseCSVfile(filePath) {
  return fs
    .readFileAsync(filePath, "utf8")
    .then(data => {
      let keys,
        noOfKeys,
        valueArray = [];
      const lines = data.split("\n");
      lines.forEach((line, index) => {
        if (index === 0) {
          keys = line
            .replace(/"([^"]+)"(,|$)/g, "$1 ")
            .trim()
            .split(" ");
          noOfKeys = keys.length;
        } else {
          let obj = {};
          line.match(/(("([^"]+)")|(\w+))(?=(,|$))/g).forEach((value, i) => {
            if (i % noOfKeys === 0) {
              obj = {};
            }
            obj[keys[i % noOfKeys]] = JSON.parse(value);
          });
          valueArray.push(obj);
        }
      });
      return valueArray;
    })
    .catch(err => console.log({ err }));
}

function seedTopics(file) {
  const ids = {};
  const topics = parseCSVfile(file).map(topic =>
    new Topics(topic).save().then(topicDoc => {
      ids[topic.slug] = topicDoc._id;
      return topicDoc;
    })
  );
  return Promise.all(topics).then(() => ids);
}

function seedUsers(file) {
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

function seedArticles(file, topicIds, userIds) {
  const ids = [];
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
    const randomVotes = Math.floor(Math.random() * 100);
    const com = {
      body: generateComments(),
      created_by: userIds[randomUser].id,
      belongs_to: articleIds[randomArticle],
      votes: randomVotes
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

module.exports = {
  generateComments,
  seedArticles,
  seedComments,
  seedUsers,
  seedTopics
};
