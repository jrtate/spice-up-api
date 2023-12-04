import pool from "../db/db.js";
import { getDay, getWeek, getYear } from "date-fns";

export const ReadCompletedTaskAsync = async (id, user) => {
  return await pool.query(
    "SELECT * FROM completed_tasks WHERE task_id=$1 AND user_id=$2;",
    [id, user.id],
  );
};

export const ReadIsTaskCompletedTodayAsync = async (id, user) => {
  return await pool.query(
    "SELECT * FROM completed_tasks WHERE task_id=$1 AND user_id=$2 AND date_created=$3;",
    [
      id,
      user.id,
      `${getYear(new Date())}-${getWeek(new Date())}-${getDay(new Date())}`,
    ],
  );
};

export const CreateCompletedTaskAsync = async (completedTask, user) => {
  return await pool.query(
    "INSERT INTO completed_tasks (task_id, completed_day, user_id, date_created) VALUES ($1, $2, $3, $4) ON CONFLICT (task_id, date_created) DO NOTHING;",
    [
      completedTask.id,
      completedTask.completedDay,
      user.id,
      `${getYear(new Date())}-${getWeek(new Date())}-${getDay(new Date())}`,
    ],
  );
};

export const DeleteCompletedTaskAsync = async (id, user) => {
  return await pool.query(
    "DELETE FROM completed_tasks WHERE task_id=$1 AND user_id=$2 AND date_created = $3 RETURNING *;",
    [
      id,
      user.id,
      `${getYear(new Date())}-${getWeek(new Date())}-${getDay(new Date())}`,
    ],
  );
};
