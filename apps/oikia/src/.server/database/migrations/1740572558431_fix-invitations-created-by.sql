-- Up Migration
ALTER TABLE invitations
  ALTER COLUMN created_by DROP NOT NULL;
