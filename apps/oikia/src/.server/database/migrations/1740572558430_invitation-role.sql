-- Up Migration
CREATE EXTENSION pgroonga;

ALTER TABLE invitations
  ADD COLUMN target_role text NOT NULL;
