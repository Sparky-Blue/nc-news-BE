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

function parseCSVfile(file) {
  return fs
    .readFileAsync(file, "utf8")
    .then(data => {
      let keys;
      let noOfKeys;
      let valueArray = [];
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
          line.split('","').forEach((value, i) => {
            let n;
            n = i % noOfKeys;
            if (n === 0) {
              obj = {};
            }
            obj[keys[n]] = value.replace(/"/, "");
          });
          valueArray.push(obj);
        }
      });
      //console.log(valueArray);
      return valueArray;
    })
    .catch(err => console.log({ err }));
}
// function seedArticles(userIds, topicIds) {
//   const ids = [];
//   const file = __dirname + "/data/articles.csv";
//   const articles = parseCSVfile(file).map(article => {
//     article.belongs_to = topicIds[article.topic];
//     const randomUser = Math.floor(Math.random() * userIds.length);
//     article.created_by = userIds[randomUser].id;
//     return new Articles(article).save().then(articleDoc => {
//       ids.push(articleDoc._id);
//     });
//   });
//   return Promise.all(articles).then(() => ids);
// }

// seedArticles([1, 2, 3, 4], {
//   football: "football",
//   coding: "coding",
//   cooking: "cooking"
// }).then(data => console.log(data));
function seedUsers() {
  const file = __dirname + "/data/users.csv";
  const ids = [];
  const users = parseCSVfile(file).map(user => {
    console.log(user);
    return new Users(user).save().then(userDoc => {
      console.log(userDoc);
      const obj = {};
      obj.id = userDoc._id;
      ids.push(obj);
      return userDoc;
    });
  });
  return Promise.all(users).then(() => ids);
}

seedUsers().then(data => console.log({ data }));
