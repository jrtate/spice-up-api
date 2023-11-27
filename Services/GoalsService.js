import res from "express/lib/response.js";
import {
  DeleteGoalPsqlAsync,
  InsertGoalAsync,
  ReadGoalByIdAsync,
  ReadGoalsAsync,
  UpdateGoalAsync,
} from "../Repositories/GoalsRepository.js";
import { GetSubGoalsByGoalIdAsync } from "./SubGoalsService.js";

export const GetGoalsAsync = async (user) => {
  try {
    const goalList = await ReadGoalsAsync(user);
    return await goalList?.rows?.map?.(async (goal) => {
      return {
        id: goal.id,
        description: goal.description,
        subGoals: await GetSubGoalsByGoalIdAsync(goal.id, user),
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const GetGoalByIdAsync = async (id, user) => {
  try {
    const goal = await ReadGoalByIdAsync(id, user);
    return {
      id: goal.id,
      description: goal.description,
      subGoals: await GetSubGoalsByGoalIdAsync(goal.id, user),
    };
  } catch (e) {
    console.log(e.message);
  }
};

export const CreateGoalAsync = async (goal, user) => {
  try {
    // Validate
    if (!goal.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }

    return await InsertGoalAsync(goal, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const EditGoalAsync = async (id, goal, user) => {
  try {
    // Validate
    const existingGoal = GetGoalByIdAsync(id, user);
    if (!id || !existingGoal) {
      return res.status(400).send("Goal does not exist.");
    }
    if (!goal.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }

    // Update
    return await UpdateGoalAsync(id, goal);
  } catch (e) {
    console.log(e.message);
  }
};

export const DeleteGoalAsync = async (id, user) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    const existingGoal = GetGoalByIdAsync(id, user);
    if (!existingGoal) {
      return res.status(204);
    }

    return await DeleteGoalPsqlAsync(id);
  } catch (e) {
    console.log(e.message);
  }
};
