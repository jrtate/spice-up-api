import pool from "../db/db.js";

export const ReadTasksAsync = async (user) => {
  return await pool.query("SELECT * FROM tasks WHERE user_id=$1;", [user.id]);
};

export const ReadTasksByGoalIdAsync = async (subGoalId, user) => {
  return await pool.query(
    "SELECT * FROM tasks WHERE sub_goal_id=$1 AND user_id=$2;",
    [subGoalId, user.id],
  );
};

export const ReadTaskAsync = async (id, user) => {
  return await pool.query("SELECT * FROM tasks WHERE id=$1 AND user_id=$2;", [
    id,
    user.id,
  ]);
};

export const InsertTaskAsync = async (task, user) => {
  return await pool.query(
    "INSERT INTO tasks (description, duration, is_recurring, is_random, days_of_week, frequency, sub_goal_id, user_id, scheduled_day) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;",
    [
      task.description,
      task.duration,
      task.isRecurring,
      task.isRandom,
      task.daysOfWeek,
      task.frequency,
      task.subGoalId || null,
      user.id,
      task.isRecurring ? null : task.scheduledDay,
    ],
  );
};

export const UpdateTaskAsync = async (id, task) => {
  return await pool.query(
    "UPDATE tasks SET description = $1, duration = $2, is_recurring = $3, is_random = $4, days_of_week = $5, frequency = $6, scheduled_day = $8 WHERE id = $7 RETURNING *;",
    [
      task.description,
      task.duration,
      task.isRecurring,
      task.isRandom,
      task.daysOfWeek,
      task.frequency,
      id,
      task.isRecurring ? null : task.scheduledDay,
    ],
  );
};

export const DeleteTaskPsqlAsync = async (id) => {
  return await pool.query("DELETE FROM tasks WHERE id=$1 RETURNING *;", [id]);
};
