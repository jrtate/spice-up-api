import {
  CompleteTaskAsync,
  GetCompletedTasksAsync,
  UnCompleteTaskAsync,
} from "../Services/TaskCompletionService.js";
import express from "express";

const TaskCompletionRouter = express.Router();
TaskCompletionRouter.get("/complete/:id", async (req, res) => {
  try {
    const task = await GetCompletedTasksAsync(req.params.id);
    res.json(task);
  } catch (e) {
    console.log(e.message);
  }
});

TaskCompletionRouter.post("/complete/:id", async (req, res) => {
  try {
    const result = await CompleteTaskAsync(req.body);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

TaskCompletionRouter.delete("/uncomplete/:id", async (req, res) => {
  try {
    const result = await UnCompleteTaskAsync(req.params.id);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

export default TaskCompletionRouter;
