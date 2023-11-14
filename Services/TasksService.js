import {
  CreateCompletedTaskAsync,
  DeleteCompletedTaskAsync,
  DeleteTaskPsqlAsync,
  InsertTaskAsync,
  ReadCompletedTaskAsync,
  ReadTaskAsync,
  ReadTasksAsync,
  UpdateTaskAsync,
  UpsertOrderAsync,
} from "../Repositories/TasksRepository.js";
import res from "express/lib/response.js";

export const GetTasksAsync = async () => {
  try {
    const taskList = await ReadTasksAsync();
    return taskList.rows.map((task) => {
      return {
        id: task.id,
        description: task.description,
        duration: task.duration,
        isRecurring: task.is_recurring,
        isRandom: task.is_random,
        daysOfWeek: task.days_of_week,
        frequency: task.frequency,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const GetTaskByIdAsync = async (id) => {
  try {
    const task = await ReadTaskAsync(id);
    return {
      id: task.id,
      description: task.description,
      duration: task.duration,
      isRecurring: task.is_recurring,
      isRandom: task.is_random,
      daysOfWeek: task.days_of_week,
      frequency: task.frequency,
    };
  } catch (e) {
    console.log(e.message);
  }
};

export const CreateTaskAsync = async (task) => {
  try {
    // Validate
    if (task.daysOfWeek.length === 0 && !task.isRandom) {
      return res
        .sendStatus(400)
        .send("Must select at least one day to schedule.");
    }
    if (!task.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }
    if (!task.duration) {
      return res.sendStatus(400).send("You must provide a duration.");
    }

    const updatedTask = RandomizeDays(task);

    // Insert
    return await InsertTaskAsync(updatedTask);
  } catch (e) {
    console.log(e.message);
  }
};

export const EditTaskAsync = async (id, task) => {
  try {
    // Validate
    const existingTask = GetTaskByIdAsync(id);
    if (!id || !existingTask) {
      return res.status(400).send("Task does not exist.");
    }
    if (task.daysOfWeek.length === 0 && !task.isRandom) {
      return res.status(400).send("Must select at least one day to schedule.");
    }
    if (!task.description) {
      return res.sendStatus(400).send("You must provide a description.");
    }
    if (!task.duration) {
      return res.sendStatus(400).send("You must provide a duration.");
    }

    const updatedTask = RandomizeDays(task);

    // Update
    return await UpdateTaskAsync(id, updatedTask);
  } catch (e) {
    console.log(e.message);
  }
};

export const DeleteTaskAsync = async (id) => {
  try {
    if (!id) {
      return res.sendStatus(400).send("Must provide an ID.");
    }
    return await DeleteTaskPsqlAsync(id);
  } catch (e) {
    console.log(e.message);
  }
};

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

export const UpsertTaskOrderAsync = async (taskOrders) => {
  try {
    for (const taskOrder of taskOrders) {
      if (!taskOrder.taskId) {
        return res.sendStatus(400).send("Must provide a taskId.");
      }
      if (!taskOrder.order) {
        return res.sendStatus(400).send("Must provide an order.");
      }
    }

    return await Promise.all(await UpsertOrderAsync(taskOrders));
    // return Promise.all(result);
  } catch (e) {
    console.log(e.message);
  }
};

const RandomizeDays = (task) => {
  let updatedTask = task;
  // Assign random dates based on frequency, if user opted in
  if (task.daysOfWeek.length === 0 && task.isRandom) {
    if (!task.frequency) {
      return res.sendStatus(400).send("Must set a frequency.");
    }

    const randomDayList = [];
    Array.from(Array(task.frequency)).forEach(() => {
      const rndInt = Math.floor(Math.random() * 7);
      randomDayList.push(rndInt);
    });

    updatedTask.daysOfWeek = randomDayList;
  } else if (task.daysOfWeek.length && task.isRandom) {
    if (!task.frequency) {
      return res.sendStatus(400).send("Must set a frequency.");
    }
    if (task.frequency > task.daysOfWeek.length) {
      return res
        .sendStatus(400)
        .send(
          "Must not set the frequency larger than days selected, if opting in to specific days.",
        );
    }

    const selectedRandomDays = task.daysOfWeek;
    const randomDayList = [];
    Array.from(Array(task.frequency)).forEach(() => {
      const max = Math.max(...selectedRandomDays);
      const min = Math.min(...selectedRandomDays);

      const randomDayFromSelection =
        selectedRandomDays[Math.floor(Math.random() * (max - min + 1) + min)];
      randomDayList.push(randomDayFromSelection);
    });

    updatedTask.daysOfWeek = randomDayList;
  }

  return updatedTask;
};
