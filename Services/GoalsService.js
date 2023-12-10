import {
  DeleteGoalPsqlAsync,
  InsertGoalAsync,
  ReadGoalByIdAsync,
  ReadGoalsAsync,
  UpdateGoalAsync,
} from "../Repositories/GoalsRepository.js";
import { GetSubGoalsByGoalIdAsync } from "./SubGoalsService.js";
import { GetCompletedGoalAsync } from "./GoalCompletionService.js";

export const GetGoalsAsync = async (user, res) => {
  try {
    const goalList = await ReadGoalsAsync(user);
    return await goalList?.rows
      ?.map?.(async (goal) => {
        return {
          id: goal.id,
          description: goal.description,
          isCompleted: await GetCompletedGoalAsync(goal.id, user),
          subGoals: await GetSubGoalsByGoalIdAsync(goal.id, user, res),
        };
      })
      ?.sort((a, b) => a.id - b.id);
  } catch (e) {
    console.log(e.message);
  }
};

export const GetGoalByIdAsync = async (id, user, res) => {
  try {
    const goal = await ReadGoalByIdAsync(id, user);
    return {
      id: goal.id,
      description: goal.description,
      subGoals: await GetSubGoalsByGoalIdAsync(goal.id, user, res),
    };
  } catch (e) {
    console.log(e.message);
  }
};

export const CreateGoalAsync = async (goal, user, res) => {
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

export const EditGoalAsync = async (id, goal, user, res) => {
  try {
    // Validate
    const existingGoal = GetGoalByIdAsync(id, user, res);
    if (!id || !existingGoal) {
      return res.status(400).send("Goal does not exist.");
    }
    if (!goal.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }

    // Update
    return await UpdateGoalAsync(id, goal, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const DeleteGoalAsync = async (id, user, res) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }

    return await DeleteGoalPsqlAsync(id, user);
  } catch (e) {
    console.log(e.message);
  }
};
