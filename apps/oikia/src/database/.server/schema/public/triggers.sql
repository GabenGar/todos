-- https://x-team.com/blog/automatic-timestamps-with-postgresql/
CREATE OR REPLACE FUNCTION trigger_set_timestamp ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;
