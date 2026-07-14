/**
 * CSS Injector Utility
 * Dynamically injects CSS custom properties based on theme configuration
 * NO BUSINESS LOGIC - Only visual styling
 */

/**
 * Converts hex color to RGB components
 * @param {string} hex - Hex color code (e.g., "#1E40AF")
 * @returns {Object} - RGB components {r, g, b}
 */
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Converts RGB to HSL
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {Object} - HSL components {h, s, l}
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts HSL to hex color
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} - Hex color code
 */
function hslToHex(h, s, l) {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Darkens a color by reducing its lightness
 * @param {string} hexColor - Hex color code
 * @param {number} percentage - Percentage to darken (0-100)
 * @returns {string} - Darkened hex color code
 */
function darkenColor(hexColor, percentage) {
  const rgb = hexToRgb(hexColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Reduce lightness by percentage
  hsl.l = Math.max(0, hsl.l - percentage);
  
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

/**
 * Injects theme colors as CSS custom properties into the document root
 * @param {Object} themeConfig - Theme configuration object
 */
export function injectThemeColors(themeConfig) {
  if (!themeConfig || !themeConfig.colors) {
    console.error('[CSSInjector] Invalid theme configuration provided');
    return;
  }

  console.log('[CSSInjector] Injecting theme colors...');

  const root = document.documentElement;
  const colors = themeConfig.colors;

  try {
    // Inject primary colors
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--text-color', colors.text);
    root.style.setProperty('--background-color', colors.background);
    root.style.setProperty('--border-color', colors.border);

    // Calculate and inject hover color (darken primary by 10%)
    const hoverColor = colors.hover || darkenColor(colors.primary, 10);
    root.style.setProperty('--hover-color', hoverColor);

    // Calculate and inject active color (darken primary by 15%)
    const activeColor = colors.active || darkenColor(colors.primary, 15);
    root.style.setProperty('--active-color', activeColor);

    // Inject disabled color
    root.style.setProperty('--disabled-color', colors.disabled);

    // Additional computed colors for better UX
    root.style.setProperty('--primary-rgb', `${hexToRgb(colors.primary).r}, ${hexToRgb(colors.primary).g}, ${hexToRgb(colors.primary).b}`);
    root.style.setProperty('--secondary-rgb', `${hexToRgb(colors.secondary).r}, ${hexToRgb(colors.secondary).g}, ${hexToRgb(colors.secondary).b}`);

    console.log('[CSSInjector] Theme colors injected successfully');
    console.log('[CSSInjector] Primary:', colors.primary, '| Hover:', hoverColor, '| Active:', activeColor);
  } catch (error) {
    console.error('[CSSInjector] Error injecting theme colors:', error);
  }
}

/**
 * Gets current CSS custom property value
 * @param {string} propertyName - CSS custom property name (e.g., '--primary-color')
 * @returns {string} - Property value
 */
export function getCSSVariable(propertyName) {
  return getComputedStyle(document.documentElement).getPropertyValue(propertyName).trim();
}

/**
 * Sets a CSS custom property value
 * @param {string} propertyName - CSS custom property name
 * @param {string} value - Property value
 */
export function setCSSVariable(propertyName, value) {
  document.documentElement.style.setProperty(propertyName, value);
}

export default injectThemeColors;
