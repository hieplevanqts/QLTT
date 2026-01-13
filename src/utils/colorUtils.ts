// Utility functions for generating distinct colors for wards

/**
 * Generate a distinct color for each ward using HSL color space
 * @param index - The index of the ward
 * @param total - Total number of wards
 * @param saturation - Saturation percentage (default: 65%)
 * @param lightness - Lightness percentage (default: 55%)
 * @returns HSL color string
 */
export function generateWardColor(
  index: number,
  total: number,
  saturation: number = 65,
  lightness: number = 55
): string {
  // Use golden ratio for better distribution
  const goldenRatio = 0.618033988749895;
  const hue = (index * goldenRatio * 360) % 360;
  
  return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
}

/**
 * Convert HSL to hex color
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  // Convert to hex
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate a map of ward names to colors
 * @param wardNames - Array of ward names
 * @returns Map of ward name to color
 */
export function generateWardColorMap(wardNames: string[]): Map<string, string> {
  const colorMap = new Map<string, string>();
  const total = wardNames.length;
  
  wardNames.forEach((name, index) => {
    const color = generateWardColor(index, total);
    colorMap.set(name, color);
  });
  
  return colorMap;
}
