# Codegen

Codegen script runs with 2 arguments:

1. `<input_folder>`<br>
   A folder with generators.
2. `<output_folder>`<br>
   A folder into which the results of generators are written.

Generator is a folder with `generator.js` file, which exports a single default async function - a function which generates the code and returs the module info.<br>
No other exported symbols are allowed within generator modules.
The outputs are saved into the same relative path to `<output_folder>` as between `<input_folder>` and the generator folder.
