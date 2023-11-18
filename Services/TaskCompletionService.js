import {
  CreateCompletedTaskAsync,
  DeleteCompletedTaskAsync,
  ReadCompletedTaskAsync,
} from "../Repositories/TaskCompletionRepository.js";
import res from "express/lib/response.js";

export const GetCompletedTasksAsync = async (id, user) => {
  try {
    const completedTaskList = await ReadCompletedTaskAsync(id, user);
    return completedTaskList.rows.map((completedTask) => {
      return {
        id: completedTask.id,
        completedDay: completedTask.completed_day,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const CompleteTaskAsync = async (completedTask, user) => {
  try {
    if (!completedTask.id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    if (!completedTask.completedDay) {
      return res.sendStatus(400).send("Must provide completedDay.");
    }
    const isCompleted = ReadCompletedTaskAsync(completedTask.id, user);
    if (!isCompleted) {
      return res.sendStatus(204);
    }

    return await CreateCompletedTaskAsync(completedTask, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const UnCompleteTaskAsync = async (id, user) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    const isCompleted = ReadCompletedTaskAsync(id, user);
    if (!isCompleted) {
      return res.sendStatus(204);
    }

    return await DeleteCompletedTaskAsync(id, user);
  } catch (e) {
    console.log(e.message);
  }
};
