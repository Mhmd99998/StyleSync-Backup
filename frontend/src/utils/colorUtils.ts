// Default hardcoded values (fallback or starting point)
const DEFAULT_KNOWN_COLORS: Record<string, string> = {
  // Blues
  "blue houndstooth": "#a5bde0",
  "navy": "#22274c",

  // Greens

  // Reds
};

// Key used for localStorage
const LOCAL_STORAGE_KEY = "customColors";

/**
 * Load known colors from localStorage if available, fallback to defaults.
 */
export const getKnownColors = (): Record<string, string> => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return stored ? JSON.parse(stored) : { ...DEFAULT_KNOWN_COLORS };
  } catch {
    return { ...DEFAULT_KNOWN_COLORS };
  }
};

/**
 * Save updated known colors to localStorage.
 */
export const saveKnownColors = (colors: Record<string, string>) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(colors));
};

/**
 * Reset known colors to defaults (clears localStorage entry).
 */
export const resetKnownColors = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

/**
 * Get a valid CSS color string for a given color name.
 */
export const getChipColor = (color: string): string => {
  const knownColors = getKnownColors();
  return knownColors[color.toLowerCase()] || color;
};

/**
 * Checks if a string is a valid CSS color.
 */
export const isValidCssColor = (color: string): boolean => {
  const s = new Option().style;
  s.color = "";
  s.color = color;
  return s.color !== "";
};

/**
 * Check if a hex color is light, for contrast/border logic.
 */
export const isLightColor = (color: string): boolean => {
  const knownColors = getKnownColors();

  let hex = color.startsWith("#") ? color.slice(1) : color;

  if (!color.startsWith("#") && knownColors[color.toLowerCase()]) {
    hex = knownColors[color.toLowerCase()].slice(1);
  }

  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join(""); // expand shorthand
  }

  if (hex.length !== 6) return false;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 200;
};
