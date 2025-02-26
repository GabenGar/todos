-- Up Migration
/*
 * Triggers.
 */
CREATE OR REPLACE FUNCTION trigger_set_timestamp ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;


/*
 * Tables.
 */
CREATE TABLE accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  login text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL,
  name text
);

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();
