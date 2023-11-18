import bcrypt from "bcryptjs";
import pool from "../db/db.js";

export const ReadUserByEmailAsync = async (email) => {
  const data = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (data.rowCount == 0) return false;
  return data.rows[0];
};

export const InsertUserAsync = async (email, password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const data = await pool.query(
    "INSERT INTO users(email, password) VALUES ($1, $2) RETURNING id, email, password",
    [email, hash],
  );

  if (data.rowCount == 0) return false;
  return data.rows[0];
};
