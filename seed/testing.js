const { Articles, Comments, Topics, Users } = require("../models/models");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { promisify } = require("util");

function parseCSVfile(file) {
  return fs
    .readFileAsync(file, "utf8")
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

seedUsers().then(data => ({ data }));
