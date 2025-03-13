WITH input_accounts AS (
  SELECT
    id,
    role
  FROM
    accounts
  WHERE
    id = ANY (
      CAST (${ids} AS bigint[])
    )
  ORDER BY
    id ASC
)
SELECT
  id,
  role,
  name
FROM
  input_accounts
ORDER BY
  id ASC
;
