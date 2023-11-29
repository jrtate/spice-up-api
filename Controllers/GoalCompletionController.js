import express from "express";
import { AuthenticateToken } from "../Services/AuthService.js";
import {
  CompleteGoalAsync,
  GetCompletedGoalAsync,
  UnCompleteGoalAsync,
} from "../Services/GoalCompletionService.js";

const GoalCompletionRouter = express.Router();
GoalCompletionRouter.get("/complete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const task = await GetCompletedGoalAsync(req.params.id, user, res);
    res.json(task);
  } catch (e) {
    console.log(e.message);
  }
});

GoalCompletionRouter.post("/complete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const result = await CompleteGoalAsync(req.params.id, user, res);
    return res.json(result?.rows);
  } catch (e) {
    console.log(e.message);
  }
});

GoalCompletionRouter.delete("/uncomplete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const result = await UnCompleteGoalAsync(req.params.id, user, res);
    return res.json(result?.rows);
  } catch (e) {
    console.log(e.message);
  }
});

export default GoalCompletionRouter;
