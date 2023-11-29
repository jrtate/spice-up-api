import express from "express";
import { AuthenticateToken } from "../Services/AuthService.js";
import {
  CreateGoalAsync,
  DeleteGoalAsync,
  EditGoalAsync,
  GetGoalsAsync,
} from "../Services/GoalsService.js";

const GoalsRouter = express.Router();

GoalsRouter.get("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const goals = await GetGoalsAsync(user);
    const results = await Promise.all(goals);
    return res.json(results);
  } catch (e) {
    console.log(e.message);
  }
});

GoalsRouter.post("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const goal = await CreateGoalAsync(req.body, user, res);
    return res.json(goal.rows);
  } catch (e) {
    console.log(e.message);
  }
});

GoalsRouter.put("/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const goal = await EditGoalAsync(req.params.id, req.body, user, res);
    return res.json(goal.rows);
  } catch (e) {
    console.log(e.message);
  }
});

GoalsRouter.delete("/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const goals = await DeleteGoalAsync(req.params.id, user);
    return res.json(goals.rows);
  } catch (e) {
    console.log(e.message);
  }
});

export default GoalsRouter;
