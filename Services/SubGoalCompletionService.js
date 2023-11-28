import res from "express/lib/response.js";
import {
  CreateCompletedSubGoalAsync,
  DeleteCompletedSubGoalAsync,
  ReadCompletedSubGoalAsync,
} from "../Repositories/SubGoalCompletionRepository.js";

export const GetCompletedSubGoalsAsync = async (id, user) => {
  try {
    const completedSubGoalsList = await ReadCompletedSubGoalAsync(id, user);
    return completedSubGoalsList.rows.map((completedSubGoal) => {
      return {
        id: completedSubGoal.id,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const CompleteSubGoalAsync = async (id, user) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }

    const isCompleted = ReadCompletedSubGoalAsync(id, user);
    if (!isCompleted) {
      return res.sendStatus(204);
    }

    return await CreateCompletedSubGoalAsync(id, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const UnCompleteSubGoalAsync = async (id, user) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    const isCompleted = ReadCompletedSubGoalAsync(id, user);
    if (!isCompleted) {
      return res.sendStatus(204);
    }

    return await DeleteCompletedSubGoalAsync(id, user);
  } catch (e) {
    console.log(e.message);
  }
};
