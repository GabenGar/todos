export interface IWebExtConfig extends IGeneralConfig {
  /**
   * Builds and then temporarily installs an extension on the target application so it can be tested.
   * By default, it watches extension source files and reloads the extension in each target as files change.
   */
  run: {
    /**
     * Open a tab at the specified URL when the browser starts.
     *
     * @example
     * "www.mozilla.com"
     *
     * @example
     * ["www.mozilla.com", "developer.mozilla.org"]
     */
    startUrl: string | string[];
    /**
     * Customize any Firefox preference without creating or modifying the profile.
     * Use the equal sign to set values.
     * @example
     * "general.useragent.locale=fr-FR"
     */
    pref?: string[];
    /**
     * Specify the application to run your extension in.
     * Specify this option multiple times to run the extension in each application concurrently.
     */
    target?: ITarget | ITarget[];
    /**
     * A list of files that should be watched for changes.
     * This is useful if you want web-ext to watch for changes to specific files without watching the extension directory tree,
     * e.g., the build output from a module bundler.
     */
    watchFiles?: string | string[];
  };
  /**
   * Reports errors in the extension manifest or other source code files.
   * When `strict_min_version` is set in your extension’s manifest file,
   * lint reports on the permissions, manifest keys, and web extension APIs used that are not available in that version.
   * See the `addons-linter` project for more information about the rules used to validate the extension source.
   */
  lint?: {
    /**
     *  The type of output to generate when reporting on errors.
     */
    output?: "json" | "text";
    /**
     * Output only metadata about the extension in JSON.
     */
    metadata?: boolean;
    /**
     * Format the JSON output so that it's easier to read.
     * This only applies when --output is set to `json`.
     */
    pretty?: boolean;
  };
  build: IBuildConfig;
}

interface IGeneralConfig {
  /**
   * The path of a directory to save artifacts in, e.g., the .zip file, when you build an extension.
   * This can be specified as a relative or absolute path and should always be a string.
   * @default
   * "./web-ext-artifacts"
   */
  artifactsDir?: string;
  /**
   * A list of glob patterns to define which files should be ignored by `build`, `run`, `lint`, and other commands.
   * If you specify relative paths, they are relative to your --source-dir.
   */
  ignoreFiles?: string[];
  /**
   * The directory of the extension's source code, e.g., when building or running an extension.
   * This can be specified as a relative or absolute path and should always be a string.
   */
  sourceDir?: string;
  /**
   * Shows verbose output when commands are run.
   */
  verbose?: boolean;
}

interface IBuildConfig {
  /**
   * Overwrite the destination package file if it exists.
   * Without this option, `web-ext` exits with an error if the destination file exists.
   */
  overwriteDest: boolean;
  /**
   * Name of the created extension package file.
   * In this option, the values defined in `manifest.json` can be used by enclosing them with `{ }`.
   *
   * @default "{name}-{version}.zip"
   */
  filename?: string;
}

type ITarget = "firefox-desktop" | "firefox-android" | "chromium";
