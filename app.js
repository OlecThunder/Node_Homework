const express = require("express");
const app = express();
const fs = require("fs");
const helmet = require("helmet");
const port = process.env.PORT || 3000;
const { onUnexist } = require("./controllers/funcDeclaration");

let tasks = JSON.parse(fs.readFileSync("taskList.json", "utf-8"));
const taskRoutes = require("./routes/tasks");

//Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("", (req, res, next) => {
  req.headers.authorization === "123" ? next() : next("Authorization error");
});

app.use("/tasks/:id", (req, res, next) => {
  const isFound = tasks.some(task => task.id === parseInt(req.params.id));
  isFound ? next() : next(`No user with id: ${req.params.id}`);
});

// Routes

app.use("/tasks", taskRoutes);
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
