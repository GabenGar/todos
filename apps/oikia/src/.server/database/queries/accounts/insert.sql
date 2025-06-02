WITH inits AS (
  SELECT
    nextval(
      pg_get_serial_sequence('public.accounts', 'id')
    ) AS id,
    login,
    password,
    role,
    name,
    invitation_code
  FROM
    json_to_recordset(${inits:json}) AS init(
      login text,
      password text,
      role text,
      name text,
      invitation_code text
    )
),
invitation_inits AS (
  SELECT
    invitations.id AS invitation_id,
    inits.id AS invited_account_id
  FROM
    inits
    INNER JOIN
    invitations
    ON
      inits.invitation_code = invitations.code
),
new_accounts AS (
  INSERT INTO accounts
    (
      id,
      login,
      password,
      role,
      name
    ) OVERRIDING SYSTEM VALUE
  SELECT
    id,
    login,
    password,
    role,
    name
  FROM
    inits
  RETURNING
    accounts.id
),
new_account_invitations AS (
  INSERT INTO invited_accounts
    (
      invitation_id,
      invited_account_id
    )
  SELECT
    invitation_id,
    invited_account_id
  FROM
    invitation_inits
)
SELECT
  id
FROM
  new_accounts
ORDER BY
  id ASC
;
