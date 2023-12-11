import {
  DeleteTaskPsqlAsync,
  InsertTaskAsync,
  ReadTaskAsync,
  ReadTasksAsync,
  ReadTasksByGoalIdAsync,
  UpdateTaskAsync,
} from "../Repositories/TasksRepository.js";
import { GetCompletedTasksAsync } from "./TaskCompletionService.js";
import { getDay, getWeek, getYear } from "date-fns";

export const GetTasksAsync = async (user) => {
  try {
    const taskList = await ReadTasksAsync(user);
    return taskList?.rows
      ?.map?.((task) => {
        return {
          id: task.id,
          description: task.description,
          duration: task.duration,
          isRecurring: task.is_recurring,
          isRandom: task.is_random,
          daysOfWeek: task.days_of_week,
          frequency: task.frequency,
          scheduledDay: task.scheduled_day,
        };
      })
      ?.sort((a, b) => a.id - b.id);
  } catch (e) {
    console.log(e.message);
  }
};

export const GetTasksByGoalIdAsync = async (subGoalId, user) => {
  try {
    const taskList = await ReadTasksByGoalIdAsync(subGoalId, user);
    return taskList?.rows
      ?.map?.(async (task) => {
        const completedTasks = await GetCompletedTasksAsync(task.id, user);
        const matchingCompletedTasks = completedTasks?.filter(
          (ct) =>
            (task?.daysOfWeek?.includes?.(ct.completedDay) &&
              // todo: make this a regular date with format instead
              `${getYear(new Date())}-${getWeek(new Date())}-${getDay(
                new Date(),
              )}` === `${ct.dateCreated}`) ||
            !task.isRecurring,
        );
        return {
          id: task.id,
          description: task.description,
          duration: task.duration,
          isRecurring: task.is_recurring,
          isRandom: task.is_random,
          isCompleted: matchingCompletedTasks.length > 0,
          daysOfWeek: task.days_of_week,
          frequency: task.frequency,
          scheduledDay: task.scheduled_day,
        };
      })
      ?.sort((a, b) => a.id - b.id);
  } catch (e) {
    console.log(e.message);
  }
};

export const GetTaskByIdAsync = async (id, user) => {
  try {
    const task = await ReadTaskAsync(id, user);
    const completedTasks = await GetCompletedTasksAsync(task.id, user);
    const matchingCompletedTasks = completedTasks?.filter(
      (ct) =>
        (task?.daysOfWeek?.includes?.(ct.completedDay) &&
          // todo: make this a regular date with format instead
          `${getYear(new Date())}-${getWeek(new Date())}-${getDay(
            new Date(),
          )}` === `${ct.dateCreated}`) ||
        !task.isRecurring,
    );
    return {
      id: task.id,
      description: task.description,
      duration: task.duration,
      isRecurring: task.is_recurring,
      isRandom: task.is_random,
      isCompleted: matchingCompletedTasks.length > 0,
      daysOfWeek: task.days_of_week,
      frequency: task.frequency,
      scheduledDay: task.scheduled_day,
    };
  } catch (e) {
    console.log(e.message);
  }
};

export const CreateTaskAsync = async (task, user, res) => {
  try {
    // Validate
    if (task.daysOfWeek.length === 0 && !task.isRandom && !task.scheduledDay) {
      return res
        .sendStatus(400)
        .send("Must select at least one day to schedule.");
    }
    if (!task.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }

    const updatedTask = RandomizeDays(task, res);

    // Insert
    return await InsertTaskAsync(updatedTask, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const EditTaskAsync = async (id, task, user, res) => {
  try {
    // Validate
    const existingTask = GetTaskByIdAsync(id, user);
    if (!id || !existingTask) {
      return res.status(400).send("Task does not exist.");
    }
    if (task.daysOfWeek.length === 0 && !task.isRandom && !task.scheduledDay) {
      return res.status(400).send("Must select at least one day to schedule.");
    }
    if (!task.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }

    const updatedTask = RandomizeDays(task, res);

    // Update
    return await UpdateTaskAsync(id, updatedTask, user);
  } catch (e) {
    console.log(e.message);
  }
};

export const DeleteTaskAsync = async (id, user, res) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    const existingTask = GetTaskByIdAsync(id, user);
    if (!existingTask) {
      return res.status(204);
    }

    return await DeleteTaskPsqlAsync(id, user);
  } catch (e) {
    console.log(e.message);
  }
};

const RandomizeDays = (task, res) => {
  if (!task.isRecurring || !task.isRandom) return task;

  let updatedTask = task;
  // Assign random dates based on frequency, if user opted in
  if (!task.frequency) {
    return res.sendStatus(400).send("Must set a frequency.");
  }

  const randomDayList = [];
  Array.from(Array(task.frequency)).forEach(() => {
    let rndInt = Math.floor(Math.random() * 7);
    // Dont add days that already exist in the list more than once
    while (randomDayList.some((day) => day === rndInt)) {
      rndInt = Math.floor(Math.random() * 7);
    }
    randomDayList.push(rndInt);
  });

  updatedTask.daysOfWeek = randomDayList;

  return updatedTask;
};
