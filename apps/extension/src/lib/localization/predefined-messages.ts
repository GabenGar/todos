export type IPredefinedMessage =
  | IExtensionID
  | IUILocale
  | IBIDIDir
  | IBIDIReversedDir
  | IBIDIStartEdge
  | IBIDIEndEdge;

/**
 * The extension's internally-generated UUID. You might use this string to construct URLs for resources inside the extension.
 * Even unlocalized extensions can use this message.
 *
 * You can't use this message in a manifest file.
 *
 * Also note that this ID is not the add-on ID returned by runtime.id, and that can be set using the browser_specific_settings key in manifest.json.
 * It's the generated UUID that appears in the add-on's URL.
 * This means that you can't use this value as the extensionId parameter to runtime.sendMessage(),
 * and can't use it to check against the id property of a runtime.MessageSender object.
 */
type IExtensionID = "@@extension_id";

/**
 * The current locale; you might use this string to construct locale-specific URLs.
 */
type IUILocale = "@@ui_locale";

/**
 * The text direction for the current locale,
 * either "ltr" for left-to-right languages such as English
 * or "rtl" for right-to-left languages such as Arabic.
 */
type IBIDIDir = "@@bidi_dir";

/**
 * If the `"@@bidi_dir"` is `"ltr"`, then this is "rtl"; otherwise, it's "ltr".
 */
type IBIDIReversedDir = "@@bidi_reversed_dir";
/**
 * If the `@@bidi_dir` is "ltr", then this is "left"; otherwise, it's "right".
 */
type IBIDIStartEdge = "@@bidi_start_edge";

/**
 * If the @@bidi_dir is "ltr", then this is "right"; otherwise, it's "left".
 */
type IBIDIEndEdge = "@@bidi_end_edge";
