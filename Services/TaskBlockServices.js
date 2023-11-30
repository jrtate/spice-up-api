import {
  ReadTaskBlockByTaskIdAsync,
  ReadTaskBlocksAsync,
  UpsertTaskBlockPsqlAsync,
} from "../Repositories/TaskBlockRepository.js";

export const GetTaskBlocksAsync = async (user) => {
  try {
    const taskOrders = await ReadTaskBlocksAsync(user);
    return taskOrders?.rows?.map?.((taskBlock) => {
      return {
        id: taskBlock.id,
        taskId: taskBlock.task_id,
        totalBlocks: taskBlock.total_blocks,
        completedBlocks: taskBlock.completed_blocks,
        dayOfWeek: taskBlock.day_of_week,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const GetTaskBlockByTaskIdAsync = async (taskId, user) => {
  try {
    const taskBlocks = await ReadTaskBlockByTaskIdAsync(user);
    return taskBlocks?.rows?.map?.((taskBlock) => {
      return {
        id: taskBlock.id,
        taskId: taskBlock.task_id,
        totalBlocks: taskBlock.total_blocks,
        completedBlocks: taskBlock.completed_blocks,
        dayOfWeek: taskBlock.day_of_week,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const UpsertTaskBlockAsync = async (taskBlock, user) => {
  try {
    // todo: validation

    return await UpsertTaskBlockPsqlAsync(taskBlock, user);
  } catch (e) {
    console.log(e.message);
  }
};
