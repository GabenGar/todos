WITH inits AS (
  SELECT
    created_by,
    code,
    expires_at,
    name,
    max_uses,
    is_active,
    title,
    description
  FROM
    json_to_recordset(${inits:json}) AS init(
      created_by bigint,
      code text,
      expires_at timestamptz,
      name text,
      max_uses bigint,
      is_active boolean,
      title text,
      description text
    )
)
INSERT INTO invitations
  (
    created_by,
    code,
    expires_at,
    name,
    max_uses,
    is_active,
    title,
    description
  )
SELECT
  created_by,
  code,
  expires_at,
  name,
  max_uses,
  is_active,
  title,
  description
FROM
  inits
RETURNING
  invitations.id
;
