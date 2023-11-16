import express from "express";
import {
  CreateTaskAsync,
  DeleteTaskAsync,
  EditTaskAsync,
  GetTaskByIdAsync,
  GetTasksAsync,
} from "../Services/TasksService.js";
import { GetCompletedTasksAsync } from "../Services/TaskCompletionService.js";
import { AuthenticateToken } from "../Services/AuthService.js";

const TaskRouter = express.Router();

TaskRouter.get("", async (req, res) => {
  try {
    AuthenticateToken(req, res);
    const tasks = await GetTasksAsync();

    // todo: move to service layer and add to get by id
    const mappedTasks = tasks.map(async (task) => {
      const completedTasks = await GetCompletedTasksAsync(task.id);
      const matchingCompletedTasks = completedTasks?.filter((ct) =>
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
    AuthenticateToken(req, res);
    const task = await GetTaskByIdAsync(req.params.id);
    res.json(task);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.post("", async (req, res) => {
  try {
    AuthenticateToken(req, res);
    const task = await CreateTaskAsync(req.body);
    return res.json(task.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.put("/:id", async (req, res) => {
  try {
    AuthenticateToken(req, res);
    const task = await EditTaskAsync(req.params.id, req.body);
    return res.json(task.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskRouter.delete("/:id", async (req, res) => {
  try {
    AuthenticateToken(req, res);
    const tasks = await DeleteTaskAsync(req.params.id);
    return res.json(tasks.rows);
  } catch (e) {
    console.log(e.message);
  }
});

export default TaskRouter;
