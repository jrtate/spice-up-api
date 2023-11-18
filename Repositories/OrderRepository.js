import pool from "../db/db.js";

export const ReadTaskOrdersAsync = async (user) => {
  return await pool.query("SELECT * FROM task_orders WHERE user_id = $1;", [
    user.id,
  ]);
};

export const UpsertOrderAsync = async (taskOrders, user) => {
  return taskOrders?.map?.(
    async (taskOrder) =>
      await pool.query(
        "INSERT INTO  task_orders (task_id, task_order, day_of_week, user_id) VALUES($1,$2,$3,$4) ON CONFLICT (task_id, day_of_week) WHERE (task_id = $1 AND day_of_week = $3) DO UPDATE SET task_order = $2;",
        [taskOrder.taskId, taskOrder.order, taskOrder.dayOfWeek, user.id],
      ),
  );
};
