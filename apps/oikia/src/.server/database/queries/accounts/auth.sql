SELECT
  id,
  login,
  password
FROM
  accounts
WHERE
  login = ${login}
;
