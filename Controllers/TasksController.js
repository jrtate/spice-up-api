import express from "express";
import {
  CompleteTaskAsync,
  CreateTaskAsync,
  DeleteTaskAsync,
  EditTaskAsync,
  GetCompletedTasksAsync,
  GetTaskByIdAsync,
  GetTasksAsync,
  UnCompleteTaskAsync,
  UpsertTaskOrderAsync,
} from "../Services/TasksService.js";

const TaskRouter = express.Router();

TaskRouter.get("", async (req, res) => {
  try {
    const tasks = await GetTasksAsync();

    // todo: move to service layer and add to get by id
    const mappedTasks = tasks.map(async (task) => {
      const completedTasks = await GetCompletedTasksAsync(task.id);
      const matchingCompletedTasks = completedTasks.filter((ct) =>
        task.daysOfWeek.includes(ct.completedDay),
      );
      task.isCompleted = matchingCompletedTasks.length > 0;
      return task;
    });
    const results = await Promise.all(mappedTasks);
    res.json(results);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.get("/:id", async (req, res) => {
  try {
    const task = await GetTaskByIdAsync(req.params.id);
    res.json(task);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.post("", async (req, res) => {
  try {
    const task = await CreateTaskAsync(req.body);
    return res.json(task.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.put("/order", async (req, res) => {
  try {
    const result = await UpsertTaskOrderAsync(req.body);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.put("/:id", async (req, res) => {
  try {
    const task = await EditTaskAsync(req.params.id, req.body);
    return res.json(task.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.delete("/:id", async (req, res) => {
  try {
    const tasks = await DeleteTaskAsync(req.params.id);
    return res.json(tasks.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.get("/complete/:id", async (req, res) => {
  try {
    const task = await GetCompletedTasksAsync(req.params.id);
    res.json(task);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.post("/complete/:id", async (req, res) => {
  try {
    const result = await CompleteTaskAsync(req.body);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.delete("/uncomplete/:id", async (req, res) => {
  try {
    const result = await UnCompleteTaskAsync(req.params.id);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

export default TaskRouter;
