import pool from "../db/db.js";
import { getWeek, getYear } from "date-fns";

export const ReadTaskBlocksAsync = async (user) => {
  return await pool.query("SELECT * FROM task_blocks WHERE user_id = $1;", [
    user.id,
  ]);
};

export const ReadTaskBlockByTaskIdAsync = async (id, user) => {
  return await pool.query(
    "SELECT * FROM task_blocks WHERE task_id=$1 AND user_id=$2;",
    [id, user.id],
  );
};

export const UpsertTaskBlockPsqlAsync = async (taskBlock, user) => {
  return await pool.query(
    "INSERT INTO  task_blocks (task_id, total_blocks, completed_blocks, day_of_week, user_id, year_week_id) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (task_id, day_of_week, year_week_id) WHERE (task_id = $1 AND day_of_week = $4 AND year_week_id = $6) DO UPDATE SET total_blocks = $2, completed_blocks = $3;",
    [
      taskBlock.taskId,
      taskBlock.totalBlocks,
      taskBlock.completedBlocks,
      taskBlock.dayOfWeek,
      user.id,
      `${getYear(new Date())}-${getWeek(new Date())}`,
    ],
  );
};
