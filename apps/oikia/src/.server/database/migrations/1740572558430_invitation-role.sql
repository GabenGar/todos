-- Up Migration
CREATE EXTENSION IF NOT EXISTS pgroonga;

-- adding a not null column this way
-- because it's immediately enforced
-- even within a transaction
-- https://stackoverflow.com/a/516016
ALTER TABLE invitations
  ADD COLUMN target_role text;

UPDATE
  invitations
SET
  target_role = 'user';

ALTER TABLE invitations
  ALTER COLUMN target_role SET NOT NULL;
