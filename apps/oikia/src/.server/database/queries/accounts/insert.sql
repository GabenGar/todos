WITH inits AS (
  SELECT
    login
    password
    name
  FROM
    json_to_recordset(${inits:json}) AS init(
      login text,
      password text,
      name text
    )
),
INSERT INTO accounts
  (
    login,
    password,
    name
  )
SELECT
  login,
  password,
  name
FROM
  inits
RETURNING
  accounts.id
;
