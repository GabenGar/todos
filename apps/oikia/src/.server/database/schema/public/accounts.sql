CREATE TABLE accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  login text UNIQUE NOT NULL,
  auth_id uuid UNIQUE NOT NULL DEFAULT gen_random_uuid (),
  password text NOT NULL,
  role text NOT NULL,
  name text
);

CREATE TABLE invitations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint REFERENCES accounts,
  code text UNIQUE NOT NULL,
  target_role text NOT NULL,
  expires_at text,
  parsed_expires_at timestamptz,
  max_uses bigint,
  is_active boolean NOT NULL DEFAULT TRUE,
  title text,
  description text
);

CREATE TABLE invited_accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invitation_id bigint NOT NULL REFERENCES invitations,
  invited_account_id bigint NOT NULL REFERENCES accounts,
  UNIQUE (invitation_id, invited_account_id)
);

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON invited_accounts
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();
