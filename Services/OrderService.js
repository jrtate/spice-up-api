import {
  ReadTaskOrdersAsync,
  UpsertOrderAsync,
} from "../Repositories/OrderRepository.js";

export const GetTaskOrdersAsync = async () => {
  try {
    const taskOrders = await ReadTaskOrdersAsync();
    return taskOrders?.rows?.map?.((taskOrder) => {
      return {
        id: taskOrder.id,
        taskId: taskOrder.task_id,
        order: taskOrder.task_order,
        dayOfWeek: taskOrder.day_of_week,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const UpsertTaskOrderAsync = async (taskOrders) => {
  try {
    /*if (taskOrders?.some?.((taskOrder) => !!taskOrder.taskId)) {
          return res.sendStatus(400).send("Must provide a taskId.");
        }
        if (taskOrders?.some?.((taskOrder) => !!taskOrder.order)) {
          return res.sendStatus(400).send("Must provide an order.");
        }*/

    return Promise.all(await UpsertOrderAsync(taskOrders));
  } catch (e) {
    console.log(e.message);
  }
};
