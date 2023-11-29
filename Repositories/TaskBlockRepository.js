import pool from "../db/db.js";

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
    "INSERT INTO  task_blocks (task_id, total_blocks, completed_blocks, last_known_duration, day_of_week, user_id) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (task_id, day_of_week) WHERE (task_id = $1 AND day_of_week = $5) DO UPDATE SET total_blocks = $2, completed_blocks = $3, last_known_duration = $4 ;",
    [
      taskBlock.taskId,
      taskBlock.totalBlocks,
      taskBlock.completedBlocks,
      taskBlock.lastKnownDuration,
      taskBlock.dayOfWeek,
      user.id,
    ],
  );
};
