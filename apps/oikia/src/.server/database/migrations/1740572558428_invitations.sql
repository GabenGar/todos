-- Up Migration
/*
 * Tables.
 */
CREATE TABLE invitations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint NOT NULL REFERENCES accounts,
  code text UNIQUE NOT NULL,
  expires_at timestamptz,
  max_uses bigint,
  is_active boolean NOT NULL DEFAULT TRUE,
  title text,
  description text
);

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TABLE invited_accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invitation_id bigint NOT NULL REFERENCES invitations,
  invited_account_id bigint NOT NULL REFERENCES accounts,
  UNIQUE (invitation_id, invited_account_id)
);

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON invited_accounts
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();
