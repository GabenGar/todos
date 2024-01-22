# Storages

## LocalStorage
Since `localStorage` operates on its values only as strings, it must only be used through wrappers which deserialize/serialize its values as JSON.
All local storage functions must perform migrations in a deferred manner.
All getters and setters must validate their values before performing their operations as `localStorage` is considered a foreign environment.
