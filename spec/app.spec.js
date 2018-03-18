process.env.NODE_ENV = "test";
const mongoose = require("mongoose");
const DB =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : require("../config/index").DB_URL[process.env.NODE_ENV];
const saveTestData = require("../seed/test.seed.js");
const app = require("../app");
const request = require("supertest")(app);
const { expect } = require("chai");
const { Topics, Articles, Users, Comments } = require("../models/models");

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
    it("GET returns status 200 and an object containing an array of all topics", () => {
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
    describe("/:topic_id/articles", () => {
      it("GET returns a 200 status and an object containing an array of all articles matching topic_id", () => {
        return request
          .get(`/api/topics/${topicIdsT.cooking}/articles`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.articles).to.be.an("array");
            expect(res.body.articles.length).to.be.equal(2);
          });
      });
    });
    describe("/articles/:topic", () => {
      it("GET returns a 200 status and an object containing an array of all articles matching topic", () => {
        return request
          .get(`/api/topics/articles/coding`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.articles).to.be.an("array");
            expect(res.body.articles.length).to.be.equal(2);
          });
      });
    });
  });

  describe("/articles", () => {
    it("GET returns 200 status and an object containing an array of articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.be.equal(6);
        });
    });
    describe("/articles/:article_id/comments", () => {
      it("GET returns 200 status and an object containing an array of comments", () => {
        return request
          .get(`/api/articles/${articleIdsT[1]}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.comments).to.be.an("array");
            expect(res.body.comments[0]).to.have.property("body");
            expect(res.body.comments[0].belongs_to).to.be.an("object");
          });
      });
      it("POST returns 201 status and adds a new comment", () => {
        return Comments.find()
          .count()
          .then(count => {
            return request
              .post(
                `/api/articles/${articleIdsT[0]}/comments?username=happyamy2016`
              )
              .send({ comment: "Hello to Jason Isaacs" })
              .set({ "Content-Type": "application/json" })
              .expect(201)
              .then(res => {
                expect(res.body).to.be.an("object");
                expect(res.body.comment.body).to.be.equal(
                  "Hello to Jason Isaacs"
                );
                const newCount = Comments.find().count();
                return Promise.all([count, newCount]);
              });
          })
          .then(([count, newCount]) => {
            expect(newCount).to.equal(count + 1);
          })
          .catch(err => console.log({ err }));
      });

      it("PUT returns 200 status and increments the articles vote up or down by one", () => {
        return Articles.findById(articleIdsT[2])
          .then(article => {
            return request
              .put(`/api/articles/${articleIdsT[2]}?vote=up`)
              .expect(200)
              .then(res => {
                expect(res.body).to.be.an("object");
                const updatedArticle = Articles.findById(articleIdsT[2]);
                return Promise.all([article, updatedArticle]);
              })
              .then(([article, updatedArticle]) => {
                expect(updatedArticle.votes).to.equal(article.votes + 1);
              });
          })
          .catch(err => console.log({ err }));
        return Articles.findById(articleIdsT[4])
          .then(article => {
            return request
              .put(`/api/articles/${articleIdsT[4]}?vote=down`)
              .expect(200)
              .then(res => {
                expect(res.body).to.be.an("object");
                const updatedArticle = Articles.findById(articleIdsT[4]);
                return Promise.all([article, updatedArticle]);
              });
          })
          .then(([article, updatedArticle]) => {
            expect(updatedArticle.votes).to.equal(article.votes - 1);
          })
          .catch(err => console.log({ err }));
      });
    });
  });

  describe("/comments/:comment_id", () => {
    it("DELETE returns status 200 and returns a deleteWriteOpResult object with ok = 1 and n = 1", () => {
      return request
        .delete(`/api/comments/${commentIdsT[0]}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.deleteResult.ok).to.be.equal(1);
          expect(res.body.deleteResult.n).to.be.equal(1);
        });
    });
    it("PUT returns 200 status and increments the comments vote up or down by one", () => {
      return Comments.findById(commentIdsT[2])
        .then(comment => {
          return request
            .put(`/api/comments/${commentIdsT[2]}?vote=up`)
            .expect(200)
            .then(res => {
              expect(res.body).to.be.an("object");
              const updatedComment = Comments.findById(commentIdsT[2]);
              return Promise.all([comment, updatedComment]);
            })
            .then(([comment, updatedComment]) => {
              expect(updatedComment.votes).to.equal(comment.votes + 1);
            });
        })
        .catch(err => console.log({ err }));
      return Comments.findById(commentIdsT[4])
        .then(comment => {
          return request
            .put(`/api/comments/${commentIdsT[4]}?vote=down`)
            .expect(200)
            .then(res => {
              expect(res.body).to.be.an("object");
              const updatedComment = Comments.findById(commentIdsT[4]);
              return Promise.all([comment, updatedComment]);
            });
        })
        .then(([comment, updatedComment]) => {
          expect(updatedComment.votes).to.equal(comment.votes - 1);
        })
        .catch(err => console.log({ err }));
    });
  });

  describe("/users", () => {
    it("GET returns status 200 and an object containing user data", () => {
      return request
        .get(`/api/users/jessjelly`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.user.username).to.be.equal("jessjelly");
          expect(res.body.user.name).to.be.equal("Jess Jelly");
        });
    });
  });
});
