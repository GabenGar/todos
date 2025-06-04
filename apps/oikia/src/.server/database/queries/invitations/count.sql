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
  AND
  (
    ${target_role} IS NULL
    OR
    target_role = ${target_role}
  )
  AND
  (
    ${is_active} IS NULL
    OR
    is_active = ${is_active}
  )
  AND
  (
    ${expires_at} IS NULL
    OR
    parsed_expires_at > ${expires_at}
  )
;
