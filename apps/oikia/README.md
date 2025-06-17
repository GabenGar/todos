# Oikia

## Database

### Add a `NOT NULL` column to existing table

The `NOT NULL` declaration is immediately enforced even with a transaction, so it has to be delayed as per [stack oveflow answer](https://stackoverflow.com/a/516016).
