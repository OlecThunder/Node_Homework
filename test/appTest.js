const expect = require("chai").expect;
const assert = require("chai").assert;
const request = require("supertest");
const fs = require("fs");
const app = require("../app");
let tasks = JSON.parse(fs.readFileSync("taskList.json", "utf-8")) || [];

describe("App", () => {
  // GET REQUEST DISCRIBTION & 400, 403 and 404 ERROR CHECKING
  describe("Get requests", () => {
    it("Getting all the tasks", done => {
      request(app)
        .get("/tasks/")
        .set("Authorization", 123)
        .then(res => {
          let body = res.body;
          assert.isArray(body, "Response should be an array of objects");
          done();
        })
        .catch(err => done(err));
    });

    it("Getting a single task", done => {
      request(app)
        .get(`/tasks/${tasks[0].id}`)
        .set("Authorization", 123)
        .then(res => {
          let body = res.body[0];
          expect(body).to.contain.property("id");
          expect(body).to.contain.property("task");
          expect(body).to.contain.property("finishTime");
          expect(body).to.contain.property("owner");
          expect(body).to.contain.property("done");
          assert.isNumber(body.id, "Proper id");
          done();
        })
        .catch(err => done(err));
    });

    /* ERROR CASES */

    it("Trying to get unexisting task", done => {
      request(app)
        .get("/tasks/00000")
        .set("Authorization", 123)
        .then(res => {
          let body = res.status;
          expect(body).to.equal(400);
          done();
        })
        .catch(err => done(err));
    });

    it("Getting unvalid url", done => {
      request(app)
        .get("/task/")
        .set("Authorization", 123)
        .then(res => {
          let body = res.status;
          expect(body).to.equal(404);
          done();
        })
        .catch(err => done(err));
    });

    it("Trying to get data without Auth key", done => {
      request(app)
        .get("/tasks/")
        .then(res => {
          let body = res.status;
          expect(body).to.equal(403);
          done();
        })
        .catch(err => done(err));
    });
  });

  // POST REQUEST DISCRIBTION & 400 ERROR CHECKING

  describe("POST requests", () => {
    it("Adding a new task", done => {
      request(app)
        .post("/tasks")
        .send({
          task: "TASK NAME",
          finishTime: "00:00",
          owner: "OWNER",
          done: false
        })
        .set("Authorization", 123)
        .then(res => {
          let body = res.body;
          expect(body).to.contain.property("id");
          expect(body).to.contain.property("task");
          expect(body).to.contain.property("finishTime");
          expect(body).to.contain.property("owner");
          expect(body).to.contain.property("done");
          assert.isNumber(body.id, "Proper id");
          assert.isAbove(body.id, 1575270000000, "Id is timestamp");
          done();
        })
        .catch(err => done(err));
    });

    /* ERROR CASES */

    it("Adding a new task without task property specified", done => {
      request(app)
        .post("/tasks")
        .send({
          finishTime: "00:00",
          owner: "OWNER",
          done: false
        })
        .set("Authorization", 123)
        .then(res => {
          let body = res.status;
          expect(body).to.equal(400);
          done();
        })
        .catch(err => done(err));
    });

    it("Adding a new task with invalid params sending", done => {
      request(app)
        .post("/tasks")
        .send({
          task: "TASK NAME",
          finishTime: 15,
          owner: true,
          done: false
        })
        .set("Authorization", 123)
        .then(res => {
          let body = res.status;
          expect(body).to.equal(400);
          done();
        })
        .catch(err => done(err));
    });
  });

  // PUT REQUEST DISCRIBTION & 400 ERROR CHECKING
  describe("PUT requests", () => {
    it("Changing a task", done => {
      request(app)
        .put(`/tasks/${tasks[0].id}`)
        .send({
          owner: "Sandra"
        })
        .set("Authorization", 123)
        .then(res => {
          let body = res.body.task;
          expect(body).to.contain.property("id");
          expect(body).to.contain.property("task");
          expect(body).to.contain.property("finishTime");
          expect(body).to.contain.property("owner");
          expect(body).to.contain.property("done");
          assert.isNumber(body.id, "Proper id");
          assert.isAbove(body.id, 1575270000000, "Id is timestamp");
          done();
        })
        .catch(err => done(err));
    });

    it("Changing a task done status to TRUE", done => {
      request(app)
        .put(`/tasks/${tasks[0].id}/done`)
        .set("Authorization", 123)
        .then(res => {
          let body = res.body;
          expect(body.message).to.equal(`Task ${tasks[0].id} was updated`);
          expect(body.task.done).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });

    /* ERROR CASES */

    it("Changing a task done status to TRUE with wrong id", done => {
      request(app)
        .put(`/tasks/00000/done`)
        .set("Authorization", 123)
        .then(res => {
          let body = res.status;
          expect(body).to.equal(400);
          done();
        })
        .catch(err => done(err));
    });
  });

  // DELETE REQUEST DISCRIBTION & 400 ERROR CHECKING
  describe("DELETE requests", () => {
    it("Removing a task", done => {
      request(app)
        .delete(`/tasks/${tasks[tasks.length - 1].id}`)
        .set("Authorization", 123)
        .then(res => {
          let body = res.body.tasks;
          assert.isArray(body, "Response should be an array of objects");
          done();
        })
        .catch(err => done(err));
    });

    /* ERROR CASES */

    it("Removing task with wrong ID", done => {
      request(app)
        .delete(`/tasks/00000/`)
        .set("Authorization", 123)
        .then(res => {
          let body = res.status;
          expect(body).to.equal(400);
          done();
        })
        .catch(err => done(err));
    });
  });
});
