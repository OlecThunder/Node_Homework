const express = require("express");
const app = express();
const fs = require("fs");
const helmet = require("helmet");
const port = process.env.PORT || 3000;
const { validateTask, schemas } = require("./validation/joiValidation");

let tasks = JSON.parse(fs.readFileSync("taskList.json", "utf-8"));
const {
  addTodo,
  removeTodo,
  getTasks,
  markDone,
  markUndone,
  changeTaskInfo,
  onUnexist
} = require("./funcDeclaration");

//Middleware

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Simple auth (if any of the task have the same owner as send in auth headers then it's 200, otherwise - 400)
app.use("", (req, res, next) => {
  tasks.map(task => (task.owner === req.headers.authorization ? next() : null));
  next("Authorization error");
});

app.use("/tasks/:id", (req, res, next) => {
  const isFound = tasks.some(task => task.id === parseInt(req.params.id));
  isFound ? next() : next(`No user with id: ${req.params.id}`);
});

// Routes

app.get("/tasks", getTasks);

app.get("/tasks/:id", getTasks);

app.post("/tasks", validateTask(schemas.addTaskSchema), addTodo);

app.put("/tasks/:id", validateTask(schemas.changeTaskScheme), changeTaskInfo);

app.put("/tasks/:id/done", markDone);

app.put("/tasks/:id/undone", markUndone);

app.delete("/tasks/:id", removeTodo);

app.all("*", onUnexist);

//Error handler

app.use("", (err, req, res, next) => {
  if (err !== "Authorization error") {
    res.status(400).json({ message: `${err}` });
  } else {
    res.status(403).json({ message: `${err}` });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
