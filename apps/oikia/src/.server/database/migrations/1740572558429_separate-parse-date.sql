-- Up Migration
ALTER TABLE invitations
  ALTER COLUMN expires_at TYPE text,
  ADD COLUMN parsed_expires_at timestamptz;
