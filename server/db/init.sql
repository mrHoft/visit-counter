CREATE TABLE counter (
  id serial PRIMARY KEY,
  name varchar(25) NOT NULL,
  value int4 NOT NULL DEFAULT 0
);

INSERT INTO counter (name) VALUES ('default') RETURNING *;