import express from "express";
import { AuthenticateToken } from "../Services/AuthService.js";
import {
  CompleteSubGoalAsync,
  GetCompletedSubGoalsAsync,
  UnCompleteSubGoalAsync,
} from "../Services/SubGoalCompletionService.js";

const SubGoalCompletionRouter = express.Router();
SubGoalCompletionRouter.get("/complete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const task = await GetCompletedSubGoalsAsync(req.params.id, user);
    res.json(task);
  } catch (e) {
    console.log(e.message);
  }
});

SubGoalCompletionRouter.post("/complete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const result = await CompleteSubGoalAsync(req.params.id, user);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

SubGoalCompletionRouter.delete("/uncomplete/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const result = await UnCompleteSubGoalAsync(req.params.id, user);
    return res.json(result.rows);
  } catch (e) {
    console.log(e.message);
  }
});

export default SubGoalCompletionRouter;
