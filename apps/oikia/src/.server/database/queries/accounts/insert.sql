WITH inits AS (
  SELECT
    login,
    password,
    role,
    name
  FROM
    json_to_recordset(${inits:json}) AS init(
      login text,
      password text,
      role text,
      name text
    )
)
INSERT INTO accounts
  (
    login,
    password,
    role,
    name
  )
SELECT
  login,
  password,
  role,
  name
FROM
  inits
RETURNING
  accounts.id
;
