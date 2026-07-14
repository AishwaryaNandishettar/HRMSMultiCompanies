/**
 * Theme Loader Utility
 * Loads theme configuration based on VITE_TENANT_ID environment variable
 * NO BUSINESS LOGIC - Only visual theming
 */

import companyATheme from '../config/themes/company-a.json';
import companyBTheme from '../config/themes/company-b.json';
import companyCTheme from '../config/themes/company-c.json';

// Default theme configuration (fallback)
const defaultTheme = {
  companyId: 'default',
  companyName: 'HRMS System',
  initials: 'HR',
  colors: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#DBEAFE',
    text: '#1F2937',
    background: '#FFFFFF',
    border: '#E5E7EB',
    hover: '#2563EB',
    active: '#1D4ED8',
    disabled: '#9CA3AF'
  },
  logos: {
    navigationLogo: '/logos/default/logo.png',
    loginLogo: '/logos/default/logo-large.png',
    faviconPath: '/logos/default/favicon.ico'
  }
};

// Theme mapping
const themeMap = {
  'company-a': companyATheme,
  'company-b': companyBTheme,
  'company-c': companyCTheme
};

/**
 * Validates theme configuration structure
 * @param {Object} theme - Theme configuration object
 * @returns {boolean} - True if valid, false otherwise
 */
function validateThemeConfig(theme) {
  if (!theme) {
    console.error('[ThemeLoader] Theme configuration is null or undefined');
    return false;
  }

  // Check required properties
  const requiredProps = ['companyId', 'companyName', 'initials', 'colors', 'logos'];
  for (const prop of requiredProps) {
    if (!theme[prop]) {
      console.error(`[ThemeLoader] Missing required property: ${prop}`);
      return false;
    }
  }

  // Check required color properties
  const requiredColors = ['primary', 'secondary', 'accent', 'text', 'background', 'border', 'hover', 'active', 'disabled'];
  for (const color of requiredColors) {
    if (!theme.colors[color]) {
      console.error(`[ThemeLoader] Missing required color: ${color}`);
      return false;
    }
    // Validate hex color format
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(theme.colors[color])) {
      console.error(`[ThemeLoader] Invalid hex color code for ${color}: ${theme.colors[color]}`);
      return false;
    }
  }

  // Check required logo properties
  const requiredLogos = ['navigationLogo', 'loginLogo', 'faviconPath'];
  for (const logo of requiredLogos) {
    if (!theme.logos[logo]) {
      console.error(`[ThemeLoader] Missing required logo path: ${logo}`);
      return false;
    }
  }

  return true;
}

/**
 * Loads theme configuration based on tenant ID from environment
 * @param {string} tenantId - Optional tenant ID override (defaults to VITE_TENANT_ID env var)
 * @returns {Object} - Theme configuration object
 */
export function loadThemeConfig(tenantId = null) {
  // Get tenant ID from parameter or environment variable
  const tenant = tenantId || import.meta.env.VITE_TENANT_ID;

  console.log('[ThemeLoader] Loading theme for tenant:', tenant);

  // Load theme from mapping
  let theme = themeMap[tenant];

  // If tenant not found, use default and log warning
  if (!theme) {
    console.warn(
      `[ThemeLoader] Unknown tenant ID: "${tenant}". Valid values are: ${Object.keys(themeMap).join(', ')}. Using default theme.`
    );
    theme = defaultTheme;
  }

  // Validate theme configuration
  if (!validateThemeConfig(theme)) {
    console.error('[ThemeLoader] Theme validation failed. Using default theme.');
    return defaultTheme;
  }

  console.log('[ThemeLoader] Successfully loaded theme:', theme.companyName);
  return theme;
}

/**
 * Gets list of available tenant IDs
 * @returns {Array} - Array of valid tenant IDs
 */
export function getAvailableTenants() {
  return Object.keys(themeMap);
}

/**
 * Gets default theme configuration
 * @returns {Object} - Default theme configuration
 */
export function getDefaultTheme() {
  return defaultTheme;
}

export default loadThemeConfig;
