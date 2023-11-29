import res from "express/lib/response.js";
import {
  CreateCompletedGoalAsync,
  DeleteCompletedGoalAsync,
  ReadCompletedGoalAsync,
} from "../Repositories/GoalCompletionRepository.js";

export const GetCompletedGoalAsync = async (id, user, res) => {
  try {
    const completedGoalList = await ReadCompletedGoalAsync(id, user);
    return completedGoalList?.rows?.length > 0;
  } catch (e) {
    console.log(e.message);
  }
};

export const CompleteGoalAsync = async (id, user, res) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }

    const isCompleted = await ReadCompletedGoalAsync(id, user);
    if (isCompleted?.rows?.length) {
      return res.sendStatus(204);
    }

    return await CreateCompletedGoalAsync(id, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const UnCompleteGoalAsync = async (id, user, res) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    const isCompleted = await ReadCompletedGoalAsync(id, user);
    if (!isCompleted?.rows?.length) {
      return res.sendStatus(204);
    }

    return await DeleteCompletedGoalAsync(id, user, res);
  } catch (e) {
    console.log(e.message);
  }
};
