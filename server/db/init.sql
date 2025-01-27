CREATE TABLE IF NOT EXISTS counter (
  id serial PRIMARY KEY,
  name varchar(25) NOT NULL UNIQUE,
  value int4 NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by varchar(25) NOT NULL DEFAULT 'default'
);

INSERT INTO counter (name) VALUES ('default'), ('counter-example') ON CONFLICT DO NOTHING RETURNING *;

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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by varchar(25) NOT NULL DEFAULT 'default'
);
