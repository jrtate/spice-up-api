import express from "express";
import { AuthenticateToken } from "../Services/AuthService.js";
import {
  GetTaskBlockByTaskIdAsync,
  GetTaskBlocksAsync,
  UpsertTaskBlockAsync,
} from "../Services/TaskBlockServices.js";

const TaskBlockRouter = express.Router();

TaskBlockRouter.get("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const results = await GetTaskBlocksAsync(user);
    res.json(results);
  } catch (e) {
    console.log(e.message);
  }
});

TaskBlockRouter.get("/:taskId", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const results = await GetTaskBlockByTaskIdAsync(req.params.taskId, user);
    res.json(results);
  } catch (e) {
    console.log(e.message);
  }
});

TaskBlockRouter.put("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    await UpsertTaskBlockAsync(req.body, user);
    return res.status(200).json({});
  } catch (e) {
    console.log(e.message);
  }
});

export default TaskBlockRouter;
