import pool from "../db/db.js";

export const SaveAccessToken = (accessToken, userID) => {
  const getUserQuery = `INSERT INTO access_tokens (access_token, user_id) VALUES ('${accessToken}', ${userID});`;

  pool.query(getUserQuery);
};

export const GetUserIDFromBearerToken = (bearerToken) => {
  const getUserIDQuery = `SELECT * FROM access_tokens WHERE access_token = '${bearerToken}';`;

  const response = pool.query(getUserIDQuery);
  return response.results && response.results.rowCount == 1
    ? response.results.rows[0].user_id
    : null;
};
