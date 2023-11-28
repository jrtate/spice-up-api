import res from "express/lib/response.js";
import {
  CreateCompletedGoalAsync,
  DeleteCompletedGoalAsync,
  ReadCompletedGoalAsync,
} from "../Repositories/GoalCompletionRepository.js";

export const GetCompletedGoalsAsync = async (id, user) => {
  try {
    const completedGoalsList = await ReadCompletedGoalAsync(id, user);
    return completedGoalsList.rows.map((completedGoal) => {
      return {
        id: completedGoal.id,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const CompleteGoalAsync = async (id, user) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }

    const isCompleted = ReadCompletedGoalAsync(id, user);
    if (!isCompleted) {
      return res.sendStatus(204);
    }

    return await CreateCompletedGoalAsync(id, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const UnCompleteGoalAsync = async (id, user) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    const isCompleted = ReadCompletedGoalAsync(id, user);
    if (!isCompleted) {
      return res.sendStatus(204);
    }

    return await DeleteCompletedGoalAsync(id, user);
  } catch (e) {
    console.log(e.message);
  }
};
