// Counters
export const initTableCounters = /* sql */ `
CREATE TABLE IF NOT EXISTS counters (
  id serial PRIMARY KEY,
  name varchar(25) NOT NULL UNIQUE,
  value int4 NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by varchar(25) NOT NULL DEFAULT 'default',
  creator_id int4 NOT NULL DEFAULT 0
);

DO $$ BEGIN
  CREATE TYPE counter_type AS ENUM ('badge', 'number', 'classic');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

INSERT INTO counters (name) VALUES ('default'), ('counter-example') ON CONFLICT DO NOTHING RETURNING *;`

// Counter
export const initTableCounter = (name: string) => /* sql */ `
CREATE TABLE IF NOT EXISTS "${name}" (
  id serial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  ip varchar(25),
  country varchar(8),
  platform varchar(25),
  agent varchar(25),
  is_mobile boolean,
  title varchar(25),
  color varchar(25),
  "type" counter_type
);`

// Users
export const initTableUsers = /* sql */ `
DO $$ BEGIN
  CREATE TYPE role AS ENUM ('admin', 'user', 'guest');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(25) NOT NULL UNIQUE,
  email varchar(25),
  role role NOT NULL DEFAULT 'user',
  token varchar(256) NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by varchar(25) NOT NULL DEFAULT 'default',
  creator_id int4 NOT NULL DEFAULT 0
);`

// Triggers
export const initTriggers = /* sql */ `
CREATE OR REPLACE FUNCTION on_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_counters_on_update
BEFORE UPDATE OF value ON counters
FOR EACH ROW WHEN (OLD.value IS DISTINCT FROM NEW.value)
EXECUTE FUNCTION on_update();

CREATE OR REPLACE TRIGGER trg_users_on_update
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION on_update();`
