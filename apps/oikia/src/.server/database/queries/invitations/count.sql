SELECT
  count(*)
FROM
  invitations
WHERE
  (
    ${code} IS NULL
    OR
    code = ${code}
  )
;
