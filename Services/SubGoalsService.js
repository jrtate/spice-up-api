import res from "express/lib/response.js";
import {
  DeleteSubGoalPsqlAsync,
  InsertSubGoalAsync,
  ReadSubGoalByGoalIdAsync,
  ReadSubGoalByIdAsync,
  UpdateSubGoalAsync,
} from "../Repositories/SubGoalsRepository.js";
import { GetTasksByGoalIdAsync } from "./TasksService.js";

export const GetSubGoalsByGoalIdAsync = async (goalId, user) => {
  try {
    // Validate
    if (!goalId) {
      return res.sendStatus(400).send("You must provide a valid subGoalId.");
    }

    const subGoalList = await ReadSubGoalByGoalIdAsync(goalId, user);
    const mappedSubGoals = subGoalList?.rows?.map?.(async (subGoal) => {
      return {
        id: subGoal.id,
        description: subGoal.description,
        tasks: await Promise.all(await GetTasksByGoalIdAsync(subGoal.id, user)),
      };
    });
    return Promise.all(mappedSubGoals);
  } catch (e) {
    console.log(e.message);
  }
};

export const CreateSubGoalAsync = async (subGoal, user) => {
  try {
    // Validate
    if (!subGoal.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }

    return await InsertSubGoalAsync(subGoal, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const EditSubGoalAsync = async (id, subGoal, user) => {
  try {
    // Validate
    const existingSubGoal = ReadSubGoalByIdAsync(id, user);
    if (!id || !existingSubGoal) {
      return res.status(400).send("Goal does not exist.");
    }
    if (!subGoal.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }

    // Update
    return await UpdateSubGoalAsync(id, subGoal);
  } catch (e) {
    console.log(e.message);
  }
};

export const DeleteSubGoalAsync = async (id, user) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    const existingSubGoal = ReadSubGoalByIdAsync(id, user);
    if (!existingSubGoal) {
      return res.status(204);
    }

    return await DeleteSubGoalPsqlAsync(id);
  } catch (e) {
    console.log(e.message);
  }
};
