import {
  CompleteTaskAsync,
  GetCompletedTasksAsync,
  UnCompleteTaskAsync,
} from "../Services/TaskCompletionService.js";
import express from "express";
import { AuthenticateToken } from "../Services/AuthService.js";

const TaskCompletionRouter = express.Router();
TaskCompletionRouter.get("/complete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const task = await GetCompletedTasksAsync(req.params.id, user);
    res.json(task);
  } catch (e) {
    console.log(e.message);
  }
});

TaskCompletionRouter.post("/complete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const result = await CompleteTaskAsync(req.body, user);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskCompletionRouter.delete("/uncomplete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const result = await UnCompleteTaskAsync(req.params.id, user);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

export default TaskCompletionRouter;
