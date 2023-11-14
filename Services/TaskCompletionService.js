import {
  CreateCompletedTaskAsync,
  DeleteCompletedTaskAsync,
  ReadCompletedTaskAsync,
} from "../Repositories/TaskCompletionRepository.js";
import res from "express/lib/response.js";

export const GetCompletedTasksAsync = async (id) => {
  try {
    const completedTaskList = await ReadCompletedTaskAsync(id);
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

export const CompleteTaskAsync = async (completedTask) => {
  try {
    if (!completedTask.id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    if (!completedTask.completedDay) {
      return res.sendStatus(400).send("Must provide completedDay.");
    }
    const isCompleted = ReadCompletedTaskAsync(completedTask.id);
    if (!isCompleted) {
      return res.sendStatus(204);
    }

    return await CreateCompletedTaskAsync(completedTask);
  } catch (e) {
    console.log(e.message);
  }
};

export const UnCompleteTaskAsync = async (id) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    const isCompleted = ReadCompletedTaskAsync(id);
    if (!isCompleted) {
      return res.sendStatus(204);
    }

    return await DeleteCompletedTaskAsync(id);
  } catch (e) {
    console.log(e.message);
  }
};
