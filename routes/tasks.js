const express = require("express");
const router = express.Router();
const fs = require("fs");
const { validateTask, schemas } = require("../validation/joiValidation");
const {
  addTodo,
  removeTodo,
  getTasks,
  markDone,
  markUndone,
  changeTaskInfo
} = require("../controllers/funcDeclaration");
let tasks = JSON.parse(fs.readFileSync("taskList.json", "utf-8")) || [];

router
  .route("/")
  .get(getTasks)
  .post(validateTask(schemas.addTaskSchema), addTodo);

router
  .route("/:id")
  .get(getTasks)
  .put(validateTask(schemas.changeTaskScheme), changeTaskInfo)
  .delete(removeTodo);

router.route("/:id/done").put(markDone);
router.route("/:id/undone").put(markUndone);

module.exports = router;
