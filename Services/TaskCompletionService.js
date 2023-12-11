import {
  CreateCompletedTaskAsync,
  DeleteCompletedTaskAsync,
  ReadCompletedTaskAsync,
  ReadIsTaskCompletedTodayAsync,
} from "../Repositories/TaskCompletionRepository.js";

export const GetCompletedTasksAsync = async (id, user) => {
  try {
    const completedTaskList = await ReadCompletedTaskAsync(id, user);
    return completedTaskList.rows.map((completedTask) => {
      return {
        id: completedTask.id,
        completedDay: completedTask.completed_day,
        dateCreated: completedTask.date_created,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const CompleteTaskAsync = async (completedTask, user, res) => {
  try {
    if (!completedTask.id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    if (!completedTask.completedDay && completedTask.completedDay !== 0) {
      return res.sendStatus(400).send("Must provide completedDay.");
    }
    const isCompleted = ReadIsTaskCompletedTodayAsync(completedTask.id, user);
    if (isCompleted.rows > 0) {
      return res.sendStatus(204);
    }

    return await CreateCompletedTaskAsync(completedTask, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const UnCompleteTaskAsync = async (id, user, res) => {
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
