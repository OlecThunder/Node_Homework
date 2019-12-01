const express = require("express");
const fs = require("fs");
let tasks = JSON.parse(fs.readFileSync("taskList.json", "utf-8"));

module.exports = {
  addTodo: (req, res) => {
    const newTask = {
      id: new Date().getTime(),
      task: req.body.task,
      finishTime: req.body.finishTime ? req.body.finishTime : "unknown",
      owner: req.body.owner ? req.body.owner : "unknown",
      done: req.body.done ? req.body.done : false
    };
    if (!newTask.task) {
      res.status(400).json({ message: "Include the task" });
    } else {
      tasks.push(newTask);
      res.status(201).json(tasks);
    }
    fs.writeFile("taskList.json", `${JSON.stringify(tasks)}`, data => {});
  },

  removeTodo: (req, res) => {
    tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
    res.status(200).json({
      message: `Task ${req.params.id} was deleted`,
      tasks
    });
    fs.writeFile("taskList.json", `${JSON.stringify(tasks)}`, data => {});
  },

  getTasks: (req, res) => {
    req.params.id !== undefined
      ? res
          .status(200)
          .json(tasks.filter(task => task.id === parseInt(req.params.id)))
      : res.status(200).json(tasks);
  },

  markDone: (req, res) => {
    tasks.map(task => {
      if (task.id === parseInt(req.params.id)) {
        task.done = true;
        res.json({ message: `Task ${req.params.id} was updated`, task });
      }
    });
    fs.writeFile("taskList.json", `${JSON.stringify(tasks)}`, data => {});
  },

  markUndone: (req, res) => {
    tasks.map(task => {
      if (task.id === parseInt(req.params.id)) {
        task.done = false;
        res.json({ message: `Task ${req.params.id} was updated`, task });
      }
    });
    fs.writeFile("taskList.json", `${JSON.stringify(tasks)}`, data => {});
  },

  //Additional

  changeTaskInfo: (req, res) => {
    const updateTask = req.body;
    tasks.map(task => {
      if (task.id === parseInt(req.params.id)) {
        (task.task = updateTask.task ? updateTask.task : task.task),
          (task.finishTime = updateTask.finishTime
            ? updateTask.finishTime
            : task.finishTime),
          (task.owner = updateTask.owner ? updateTask.owner : task.owner),
          (task.done = updateTask.done ? updateTask.done : task.done);
        res.json({ message: `Task ${req.params.id} was updated`, task });
      }
    });
    fs.writeFile("taskList.json", `${JSON.stringify(tasks)}`, data => {});
  },

  onUnexist: (req, res) => {
    res.status(404).json({ message: "Fatal 404, there isn't such a page" });
  }
};
