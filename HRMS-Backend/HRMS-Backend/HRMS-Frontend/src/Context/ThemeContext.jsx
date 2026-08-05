/**
 * Theme Context Provider
 * Provides theme configuration to all components throughout the application
 * NO BUSINESS LOGIC - Only visual theming
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadThemeConfig } from '../Utils/themeLoader';
import { injectThemeColors } from '../Utils/cssInjector';

// Create Theme Context
const ThemeContext = createContext(null);

/**
 * Hook to use theme context
 * @returns {Object} - Theme configuration and utility functions
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme Provider Component
 * Loads theme configuration on mount and provides it to children
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} - Theme Provider
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('[ThemeContext] Initializing theme...');
      
      // Load theme configuration
      const themeConfig = loadThemeConfig();
      
      if (!themeConfig) {
        throw new Error('Failed to load theme configuration');
      }

      // Set theme state
      setTheme(themeConfig);
      
      // Inject CSS custom properties
      injectThemeColors(themeConfig);
      
      // Update document title with company name
      document.title = `${themeConfig.companyName} - HRMS`;
      
      // Update favicon if provided
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon && themeConfig.logos.faviconPath) {
        favicon.href = themeConfig.logos.faviconPath;
      }
      
      console.log('[ThemeContext] Theme initialized successfully:', themeConfig.companyName);
      setLoading(false);
    } catch (err) {
      console.error('[ThemeContext] Error initializing theme:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6B7280', textAlign: 'center' }}>Loading theme...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '400px',
          padding: '24px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#991B1B', marginTop: 0 }}>Theme Loading Error</h2>
          <p style={{ color: '#7F1D1D' }}>{error}</p>
          <p style={{ color: '#7F1D1D', fontSize: '14px' }}>
            Please check the console for more details or contact support.
          </p>
        </div>
      </div>
    );
  }

  // Theme context value
  const value = {
    theme,
    companyName: theme.companyName,
    companyId: theme.companyId,
    initials: theme.initials,
    colors: theme.colors,
    logos: theme.logos
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
