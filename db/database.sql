CREATE DATABASE spiceup;

--psql -U postgres
--\c spiceup

-- Create Tables
CREATE TABLE IF NOT EXISTS goals(
  id SERIAL PRIMARY KEY,
  description VARCHAR(50),
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_tasks_user_id
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sub_goals(
  id SERIAL PRIMARY KEY,
  description VARCHAR(50),
  goal_id INTEGER NOT NULL,
  CONSTRAINT fk_sub_goals_goal_id
    FOREIGN KEY(goal_id)
    REFERENCES goals(id)
    ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_tasks_user_id
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks(
  id SERIAL PRIMARY KEY,
  description VARCHAR(50),
  duration INTEGER NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT TRUE,
  is_random BOOLEAN NOT NULL DEFAULT FALSE,
  days_of_week INTEGER[] NULL,
  frequency INTEGER NULL,
  sub_goal_id INTEGER NULL,
  CONSTRAINT fk_tasks_sub_goal_id
    FOREIGN KEY(sub_goal_id)
    REFERENCES sub_goals(id)
    ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_tasks_user_id
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS completed_tasks(
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL,
  completed_day INTEGER NOT NULL,
  CONSTRAINT fk_completed_tasks_task_id
    FOREIGN KEY(task_id)
    REFERENCES tasks(id)
    ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_completed_tasks_user_id
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_orders(
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL,
  task_order INTEGER NOT NULL,
  CONSTRAINT fk_task_orders_task_id
    FOREIGN KEY(task_id)
    REFERENCES tasks(id)
    ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  UNIQUE (task_id, day_of_week),
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_task_orders_user_id
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(128) UNIQUE,
  password VARCHAR(60)
);
