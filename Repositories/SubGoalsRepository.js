import pool from "../db/db.js";

export const ReadSubGoalByIdAsync = async (id, user) => {
  return await pool.query(
    "SELECT * FROM sub_goals WHERE id=$1 AND user_id=$2;",
    [id, user.id],
  );
};

export const ReadSubGoalByGoalIdAsync = async (goalId, user) => {
  return await pool.query(
    "SELECT * FROM sub_goals WHERE goal_id=$1 AND user_id=$2;",
    [goalId, user.id],
  );
};

export const InsertSubGoalAsync = async (subGoal, user) => {
  return await pool.query(
    "INSERT INTO sub_goals (description, goal_id, user_id) VALUES ($1, $2, $3) RETURNING *;",
    [subGoal.description, subGoal.goalId, user.id],
  );
};

export const UpdateSubGoalAsync = async (id, subGoal) => {
  return await pool.query(
    "UPDATE sub_goals SET description = $1 WHERE id = $2 RETURNING *;",
    [subGoal.description, id],
  );
};

export const DeleteSubGoalPsqlAsync = async (id) => {
  return await pool.query("DELETE FROM sub_goals WHERE id=$1 RETURNING *;", [
    id,
  ]);
};
