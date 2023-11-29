import pool from "../db/db.js";

export const ReadCompletedSubGoalAsync = async (id, user) => {
  return await pool.query(
    "SELECT * FROM completed_sub_goals WHERE sub_goal_id=$1 AND user_id=$2;",
    [id, user.id],
  );
};

export const CreateCompletedSubGoalAsync = async (id, user) => {
  return await pool.query(
    "INSERT INTO completed_sub_goals (sub_goal_id, user_id) VALUES ($1, $2) RETURNING *;",
    [id, user.id],
  );
};

export const DeleteCompletedSubGoalAsync = async (id, user) => {
  return await pool.query(
    "DELETE FROM completed_sub_goals WHERE sub_goal_id=$1 AND user_id=$2 RETURNING *;",
    [id, user.id],
  );
};
