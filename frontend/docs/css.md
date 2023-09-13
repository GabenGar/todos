# Cascading Style Sheets (CSS)

## Custom properties

Custom properties are separated into these categories:

- `global`<br>
  Are declared in the `/styles/variables.scss` and their values must not be reassigned at component level.

- `local`<br>
  Are declared in the css module files, their names are always prefixed with `local` and can be reassigned whatever.

## SASS

Due to each css module being built as a separate root, as far as SASS module system concerned, SASS-specific declarations (such as variables, mixins, etc...) must be declared separately to avoid specifity issues due to redeclarations.
