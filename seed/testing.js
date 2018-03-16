const { Articles, Comments, Topics, Users } = require("../models/models");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { promisify } = require("util");

function parseCSVfile(file) {
  return fs
    .readFileAsync(file, "utf8")
    .then(data => {
      // let keys,
      //   noOfKeys,
      //   valueArray = [];
      const lines = data.split("\n");
      const [keyString, valueStrings] = data.split("\n");
      // console.log(keyStrings, valueStrings);
      // const keys = keyString.split(",");
      // valueStrings.map(valueString => {
      //   valueString.split(",").reduce((acc, value) => {
      //     acc[keys[i]] = value;
      //     return acc;
      //   }, {});
        // });
        // lines.forEach((line, index) => {
        //   if (index === 0) {
        //     keys = line
        //       .replace(/"([^"]+)"(,|$)/g, "$1 ")
        //       .trim()
        //       .split(" ");
        //     noOfKeys = keys.length;
        //   } else {
        //     let obj = {};
        // const newObj = line
        //   .match(/(("([^"]+)")|(\w+))(?=(,|$))/g)
        //   .reduce((acc, value) => {
        //     acc[keys[i]] = value;
        //     return acc;
        //   }, {});

        // .forEach((value, i) => {
        //       if (i % noOfKeys === 0) {
        //         obj = {};
        //       }
        //       obj[keys[i % noOfKeys]] = JSON.parse(value);
        //     });
        // valueArray.push(newObj);
        // }
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
