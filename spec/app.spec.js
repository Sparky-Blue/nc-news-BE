process.env.NODE_ENV = "test";
const mongoose = require("mongoose");
const DB = require("../config/index").DB_URL[process.env.NODE_ENV];
const saveTestData = require("../seed/test.seed.js");
const app = require("../app");
const request = require("supertest")(app);
const { expect } = require("chai");

describe("/api", () => {
  let articleIdsT, userIdsT, topicIdsT, commentIdsT;
  beforeEach(() => {
    return mongoose
      .disconnect()
      .then(() => saveTestData(DB))
      .then(([articleIds, userIds, topicIds, commentIds]) => {
        articleIdsT = articleIds;
        userIdsT = userIds;
        topicIdsT = topicIds;
        commentIdsT = commentIds;
      });
  });
  after(() => {
    return mongoose.disconnect();
  });
  describe("/topics", () => {
    it("GET returns status 200 and an object", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.topics).to.be.an("array");
          const slugList = res.body.topics.map(topic => topic.slug);
          expect(slugList).to.have.members(["cooking", "football", "coding"]);
        });
    });
  });
  describe("/topics/:topic_id/articles", () => {
    it("GET returns all articles for topic by id", () => {
      return request
        .get(`/api/topics/football/articles`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.be.equal(2);
        });
    });
  });
  describe("/articles", () => {
    it("GET returns 200 status and an array of articles", () => {
      return request
        .get(`/api/articles`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.be.equal(6);
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("GET returns 200 status and an array of comments", () => {
      return request
        .get(`/api/articles/${articleIdsT[0]}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.comments).to.be.an("array");
        });
    });
    it("POST returns 201 status and adds a new comment", () => {
      return request
        .get(`/api/articles/${articleIdsT[0]}/comments`)
        .send({ comment: "Test" })
        .set({ "Content-Type": "application/json" })
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.comment).to.be.equal("Test");
        });
    });
  });
});
