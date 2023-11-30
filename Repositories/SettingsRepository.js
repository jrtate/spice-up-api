import pool from "../db/db.js";

export const ReadSettingsAsync = async (user) => {
  return await pool.query("SELECT * FROM settings WHERE user_id = $1;", [
    user.id,
  ]);
};

export const UpsertSettingsPsqlAsync = async (settings, user) => {
  return await pool.query(
    "INSERT INTO settings (work_block_duration, break_block_duration, user_id) VALUES($1,$2,$3) ON CONFLICT (user_id) WHERE (user_id = $3) DO UPDATE SET work_block_duration = $1, break_block_duration = $2;",
    [settings.workBlockDuration, settings.breakBlockDuration, user.id],
  );
};
