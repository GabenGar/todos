WITH input_accounts AS (
  SELECT
    id,
    created_at,
    role,
    name
  FROM
    accounts
  WHERE
    id = ANY (CAST(${ids} AS bigint[]))
),
-- invites are only used for registration
-- so no reason to have a separate many query
input_invitations AS (
  SELECT
    invitations.id,
    invitations.code,
    invitations.title,
    invited_accounts.invited_account_id
  FROM
    input_accounts
    INNER JOIN
    invited_accounts
    ON
      input_accounts.id = invited_accounts.invited_account_id
    INNER JOIN
    invitations
    ON
      invited_accounts.invitation_id = invitations.id
),
output_accounts AS (
  SELECT
    input_accounts.id,
    input_accounts.created_at,
    input_accounts.role,
    input_accounts.name,
    (
      CASE
        WHEN
          input_invitations.id IS NULL
        THEN
          NULL
        ELSE
          (
            SELECT json_build_object(
              'id', input_invitations.id,
              'code', input_invitations.code,
              'title', input_invitations.title
            )
          )
      END
    ) AS invited_through
  FROM
    input_accounts
    LEFT JOIN
    input_invitations
    ON
      input_accounts.id = input_invitations.invited_account_id
)
SELECT
  id,
  created_at,
  role,
  name,
  invited_through
FROM
  output_accounts
;
