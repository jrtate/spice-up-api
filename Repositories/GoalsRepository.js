import pool from "../db/db.js";

export const ReadGoalsAsync = async (user) => {
  return await pool.query("SELECT * FROM goals WHERE user_id=$1;", [user.id]);
};

export const ReadGoalByIdAsync = async (id, user) => {
  return await pool.query("SELECT * FROM goals WHERE id=$1 AND user_id=$2;", [
    id,
    user.id,
  ]);
};

export const InsertGoalAsync = async (goal, user) => {
  return await pool.query(
    "INSERT INTO goals (description, user_id) VALUES ($1, $2) RETURNING *;",
    [goal.description, user.id],
  );
};

export const UpdateGoalAsync = async (id, goal) => {
  return await pool.query(
    "UPDATE goals SET description = $1 WHERE id = $2 RETURNING *;",
    [goal.description, id],
  );
};

export const DeleteGoalPsqlAsync = async (id) => {
  return await pool.query("DELETE FROM goals WHERE id=$1 RETURNING *;", [id]);
};
