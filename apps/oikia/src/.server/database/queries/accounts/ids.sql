SELECT
  id
FROM
  accounts
WHERE
 (
    ${role} IS NULL
    OR
    role = ${role}
  )
ORDER BY
  id ASC
LIMIT ${limit}
OFFSET ${offset}
;
