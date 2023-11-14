import pool from "../db/db.js";

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
