import express from "express";
import { AuthenticateToken } from "../Services/AuthService.js";
import {
  CreateSubGoalAsync,
  DeleteSubGoalAsync,
  EditSubGoalAsync,
} from "../Services/SubGoalsService.js";

const SubGoalsRouter = express.Router();

SubGoalsRouter.post("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const goal = await CreateSubGoalAsync(req.body, user, res);
    return res.json(goal.rows);
  } catch (e) {
    console.log(e.message);
  }
});

SubGoalsRouter.put("/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const goal = await EditSubGoalAsync(req.params.id, req.body, user, res);
    return res.json(goal.rows);
  } catch (e) {
    console.log(e.message);
  }
});

SubGoalsRouter.delete("/:id", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const goals = await DeleteSubGoalAsync(req.params.id, user, res);
    return res.json(goals.rows);
  } catch (e) {
    console.log(e.message);
  }
});

export default SubGoalsRouter;
