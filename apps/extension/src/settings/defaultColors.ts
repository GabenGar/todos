import { getSettings } from "./settings";

export const RESULT_FONT_COLOR_LIGHT = "#000000";
export const RESULT_FONT_COLOR_DARK = "#e6e6e6";
export const CANDIDATE_FONT_COLOR_LIGHT = "#737373";
export const CANDIDATE_FONT_COLOR_DARK = "#aaaaaa";
export const BG_COLOR_LIGHT = "#ffffff";
export const BG_COLOR_DARK = "#181818";

/**
 * Return style object if color override is enabled
 */
export function getResultFontColor() {
  const isOverrideColors = getSettings("isOverrideColors");

  if (!isOverrideColors) return undefined;

  const fontColor = { color: getSettings("resultFontColor") };

  return fontColor;
}

/**
 * Return style object if color override is enabled
 */
export function getCandidateFontColor() {
  const isOverrideColors = getSettings("isOverrideColors");

  if (!isOverrideColors) return undefined;

  const fontColor = { color: getSettings("candidateFontColor") };

  return fontColor;
}

/**
 * Return style object if color override is enabled
 */
export function getBackgroundColor() {
  const isOverrideColors = getSettings("isOverrideColors");

  if (!isOverrideColors) return undefined;

  const backgroundColor = { backgroundColor: getSettings("bgColor") };

  return backgroundColor;
}
