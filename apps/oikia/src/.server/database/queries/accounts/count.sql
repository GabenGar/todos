SELECT
  count(*)
FROM
  accounts
WHERE
  (
    ${role} IS NULL
    OR
    role = ${role}
  )
