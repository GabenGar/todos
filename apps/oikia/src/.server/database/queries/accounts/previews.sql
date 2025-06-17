SELECT
  id,
  created_at,
  role,
  name
FROM
  accounts
WHERE
  id = ANY (
    CAST(${ids} AS bigint[])
  )
;
