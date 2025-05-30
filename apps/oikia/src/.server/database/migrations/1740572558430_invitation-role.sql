-- Up Migration
ALTER TABLE invitations
  ADD COLUMN target_role text NOT NULL;
