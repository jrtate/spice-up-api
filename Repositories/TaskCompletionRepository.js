import pool from "../db/db.js";

export const ReadCompletedTaskAsync = async (id, user) => {
  return await pool.query(
    "SELECT * FROM completed_tasks WHERE task_id=$1 AND user_id=$2;",
    [id, user.id],
  );
};

export const CreateCompletedTaskAsync = async (completedTask, user) => {
  return await pool.query(
    "INSERT INTO completed_tasks (task_id, completed_day, user_id) VALUES ($1, $2, $3) RETURNING *;",
    [completedTask.id, completedTask.completedDay, user.id],
  );
};

export const DeleteCompletedTaskAsync = async (id, user) => {
  return await pool.query(
    "DELETE FROM completed_tasks WHERE task_id=$1 AND user_id=$2 RETURNING *;",
    [id, user.id],
  );
};
