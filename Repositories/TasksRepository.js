import pool from "../db/db.js";

export const ReadTasksAsync = async () => {
  return await pool.query("SELECT * FROM tasks");
};

export const ReadTaskAsync = async (id) => {
  return await pool.query("SELECT * FROM tasks WHERE id=$1;", [id]);
};

export const InsertTaskAsync = async (task) => {
  return await pool.query(
    "INSERT INTO tasks (description, duration, is_recurring, is_random, days_of_week, frequency) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
    [
      task.description,
      task.duration,
      task.isRecurring,
      task.isRandom,
      task.daysOfWeek,
      task.frequency,
    ],
  );
};

export const UpdateTaskAsync = async (id, task) => {
  return await pool.query(
    "UPDATE tasks SET description = $1, duration = $2, is_recurring = $3, is_random = $4, days_of_week = $5, frequency = $6 WHERE id = $7 RETURNING *;",
    [
      task.description,
      task.duration,
      task.isRecurring,
      task.isRandom,
      task.daysOfWeek,
      task.frequency,
      id,
    ],
  );
};

export const DeleteTaskPsqlAsync = async (id) => {
  return await pool.query("DELETE FROM tasks WHERE id=$1 RETURNING *;", [id]);
};

export const ReadCompletedTaskAsync = async (id) => {
  return await pool.query("SELECT * FROM completed_tasks WHERE task_id=$1;", [
    id,
  ]);
};

export const CreateCompletedTaskAsync = async (completedTask) => {
  return await pool.query(
    "INSERT INTO completed_tasks (task_id, completed_day) VALUES ($1, $2) RETURNING *;",
    [completedTask.id, completedTask.completedDay],
  );
};

export const DeleteCompletedTaskAsync = async (id) => {
  return await pool.query(
    "DELETE FROM completed_tasks WHERE task_id=$1 RETURNING *;",
    [id],
  );
};

export const UpsertOrderAsync = async (taskOrders) => {
  return taskOrders.map(
    async (taskOrder) =>
      await pool.query(
        "INSERT INTO  task_orders (task_id, task_order) VALUES($1,$2) ON CONFLICT (task_id) WHERE (task_id = $1) DO UPDATE SET task_order = $2;",
        [taskOrder.taskId, taskOrder.order],
      ),
  );
};
