const assert = require("chai").assert;
const express = require("express");
const app = express();
const { sayHello, addNumbers } = require("../myT");
const taskRoutes = require("../routes/tasks");
const {
  addTodo,
  removeTodo,
  getTasks,
  markDone,
  markUndone,
  changeTaskInfo
} = require("../controllers/funcDeclaration");

console.log(taskRoutes);

describe("FuncDeclaration", () => {
  it("Get request should return array of objects", () => {
    let result = taskRoutes.route("/").get(getTasks);
    assert.typeOf(result, "Object");
  });
});

describe("App", () => {
  it("sayHello should return hello", () => {
    let result = sayHello();
    assert.equal(result, "hello");
  });

  it("sayHello should return type string", () => {
    let result = sayHello();
    assert.typeOf(result, "string");
  });

  it("Should return value above 5", () => {
    let result = addNumbers(5, 5);
    assert.isAbove(result, 5);
  });

  it("Should return numeric", () => {
    let result = addNumbers(5, 5);
    assert.typeOf(result, "number");
  });
});
