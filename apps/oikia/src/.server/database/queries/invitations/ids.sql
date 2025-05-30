SELECT
  id
FROM
  invitations
WHERE
  (
    ${code} IS NULL
    OR
    code = ${code}
  )
ORDER BY
  id ASC
LIMIT ${limit}
OFFSET ${offset}
;
