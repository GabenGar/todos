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
