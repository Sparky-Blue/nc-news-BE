process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const { expect } = require("chai");
const mongoose = require("mongoose");

describe("/api", () => {
  // it("GET renders html page with end points", () => {
  //   return request
  //     .get("/api")
  //     .expect(200)
  //     .then(res => {
  //       expect(res.body).to.be.an("object");
  //       expect(res.body.topics).to.be.an("array");
  //       //expect(res.body.topics).to.include("cooking");
  //     });
  // });
  describe("/topics", () => {
    it("GET returns status 200 and an object", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.topics).to.be.an("array");
          //expect(res.body.topics).to.include("cooking");
        });
    });
  });
});
