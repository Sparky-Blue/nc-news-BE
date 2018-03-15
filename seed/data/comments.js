const faker = require("faker");

function generateComments() {
  return faker.hacker.phrase();
}

module.exports = generateComments;
