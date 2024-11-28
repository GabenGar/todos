// @ts-expect-error no types
import browserInfo from "browser-info";
import manifest from "../manifest-chrome.json";

function getShortcut(commandId: string) {
  // @ts-expect-error no type for manifest
  const suggestedKeys = manifest?.commands[commandId].suggested_key || null;

  if (!suggestedKeys) {
    return null;
  }

  const os = browserInfo().os;

  switch (os) {
    case "Windows":
      return suggestedKeys.windows || suggestedKeys.default;
    case "OS X":
      return suggestedKeys.mac || suggestedKeys.default;
    case "Linux":
      return suggestedKeys.linux || suggestedKeys.default;
    case "Android":
      return suggestedKeys.android || suggestedKeys.default;
    case "iOS":
      return suggestedKeys.ios || suggestedKeys.default;
    default:
      return suggestedKeys.default || null;
  }
}

export default getShortcut;
