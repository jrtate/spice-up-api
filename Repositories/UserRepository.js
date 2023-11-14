import crypto from "crypto";
import pool from "../db/db.js";

export const Register = async (username, password) => {
  const shaPass = crypto.createHash("sha256").update(password).digest("hex");
  const query = `INSERT INTO users (username, user_password) VALUES ('${username}', '${shaPass}')`;

  await pool.query(query);
};

export const GetUser = async (username, password) => {
  const shaPass = crypto.createHash("sha256").update(password).digest("hex");
  const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND user_password = '${shaPass}'`;

  const response = await pool.query(getUserQuery);
  return response.results && response.results.rowCount === 1
    ? response.results.rows[0]
    : null;
};

export const IsValidUser = async (username) => {
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  const result = await pool.query(query);
  return result.rows === 0;
};
