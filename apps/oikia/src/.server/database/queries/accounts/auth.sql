SELECT
  id,
  auth_id,
  login,
  password
FROM
  accounts
WHERE
  (
    ${login} IS NULL
    OR
    login = ${login}
  )
  AND
  (
    ${auth_id} IS NULL
    OR
    auth_id = ${auth_id}
  )
;
