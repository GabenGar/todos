# JSON Schema to Typescript Module


## Test Runner

1. Collect generators.
2. Run generators.
3. Save outputs.
4. Format everything.
4. Compare outputs to expected outputs.


## JSON Schema Module Generator

Given the `<input_folder>` and `<output_folder>`:

1. Iterate over `<input_folder>` recursively and for each schema document collect this data:
  - `modulePath` - a relative path against `<input_folder>`.
  - `id` - `"$id"` of schema document.
  - `externalRefs` - refs pointing to other schemas.
  - `internalRefs` - refs within the schema document.
  - `schema`
