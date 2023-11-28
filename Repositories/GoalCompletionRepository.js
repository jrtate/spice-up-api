import pool from "../db/db.js";

export const ReadCompletedGoalAsync = async (id, user) => {
  return await pool.query(
    "SELECT * FROM completed_goals WHERE goal_id=$1 AND user_id=$2;",
    [id, user.id],
  );
};

export const CreateCompletedGoalAsync = async (completedGoal, user) => {
  return await pool.query(
    "INSERT INTO completed_goals (goal_id, user_id) VALUES ($1, $2) RETURNING *;",
    [completedGoal.id, user.id],
  );
};

export const DeleteCompletedGoalAsync = async (id, user) => {
  return await pool.query(
    "DELETE FROM completed_goals WHERE goal_id=$1 AND user_id=$2 RETURNING *;",
    [id, user.id],
  );
};
