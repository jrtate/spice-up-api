CREATE DATABASE spiceup;

--psql -U postgres
--\c spiceup

-- Create Tables
CREATE TABLE IF NOT EXISTS tasks(
  id SERIAL PRIMARY KEY,
  description VARCHAR(50),
  duration INTEGER NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT TRUE,
  is_random BOOLEAN NOT NULL DEFAULT FALSE,
  days_of_week INTEGER[] NULL,
  frequency INTEGER NULL
);

CREATE TABLE IF NOT EXISTS completed_tasks(
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL,
  completed_day INTEGER NOT NULL,
  CONSTRAINT fk_completed_tasks_task_id
    FOREIGN KEY(task_id)
    REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS task_orders(
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL,
  task_order INTEGER NOT NULL,
  CONSTRAINT fk_task_orders_task_id
    FOREIGN KEY(task_id)
    REFERENCES tasks(id)
);

-- Create Oauth 2.0 Tables
CREATE TABLE IF NOT EXISTS public.users
(
    id serial,
    username text,
    user_password text,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.users
    OWNER to postgres;



CREATE TABLE IF NOT EXISTS public.access_tokens
(
    id serial,
    access_token text,
    user_id integer,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.access_tokens
    OWNER to postgres;