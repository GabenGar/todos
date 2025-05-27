WITH inits AS (
  SELECT
    created_by,
    code,
    expires_at,
    (
      CAST expires_at AS timestamptz
    ) AS parsed_expires_at
    name,
    max_uses,
    title,
    description
  FROM
    json_to_recordset(${inits:json}) AS init(
      created_by bigint,
      code text,
      expires_at text,
      name text,
      max_uses bigint,
      title text,
      description text
    )
)
INSERT INTO invitations
  (
    created_by,
    code,
    expires_at,
    parsed_expires_at,
    name,
    max_uses,
    title,
    description
  )
SELECT
  created_by,
  code,
  expires_at,
  parsed_expires_at,
  name,
  max_uses,
  title,
  description
FROM
  inits
RETURNING
  invitations.id
;
