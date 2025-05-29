WITH input_invitations AS (
  SELECT
    id,
    created_at,
    updated_at,
    created_by,
    code,
    expires_at,
    max_uses,
    is_active,
    title,
    description
  FROM
    invitations
  WHERE
    id = ANY (
      CAST (${ids} AS bigint[])
    )
),
input_account_items AS (
  SELECT
    accounts.id,
    accounts.name
  FROM
    input_invitations
    INNER JOIN
    accounts
    ON
      input_invitations.created_by = accounts.id
),
output_invitations AS (
  SELECT
    input_invitations.id,
    input_invitations.created_at,
    input_invitations.updated_at,
    input_invitations.code,
    input_invitations.expires_at,
    input_invitations.max_uses,
    input_invitations.is_active,
    input_invitations.title,
    input_invitations.description,
    (
      CASE
        WHEN
          input_account_items.id IS NULL
        THEN
          NULL
        ELSE
          (
            SELECT json_build_object(
              'id', input_account_items.id,
              'name', input_account_items.name
            )
          )
      END
    ) AS created_by
  FROM
    input_invitations
    LEFT JOIN
    input_account_items
    ON
      input_invitations.created_by = input_account_items.id
)
SELECT
  id,
  created_at,
  updated_at,
  created_by,
  code,
  expires_at,
  max_uses,
  is_active,
  title,
  description
FROM
  output_invitations
;
