/**
 * Initial Logo Component
 * Displays company initials as a temporary logo placeholder
 * NO BUSINESS LOGIC - Only visual branding
 */

import React from 'react';

/**
 * InitialLogo Component
 * @param {Object} props - Component props
 * @param {string} props.initials - Company initials (e.g., "TH", "WP", "PS")
 * @param {string} props.backgroundColor - Background color for logo (hex code)
 * @param {number} props.size - Logo size in pixels (48 or 120)
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} - Initial logo element
 */
const InitialLogo = ({ 
  initials, 
  backgroundColor, 
  size = 48,
  className = ''
}) => {
  // Determine font size based on logo size
  const fontSize = size === 120 ? 48 : 20;
  
  const logoStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: backgroundColor || 'var(--primary-color)',
    color: '#FFFFFF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: `${fontSize}px`,
    fontWeight: 600,
    borderRadius: '8px',
    textTransform: 'uppercase',
    userSelect: 'none',
    flexShrink: 0
  };

  return (
    <div 
      className={`initial-logo ${className}`}
      style={logoStyle}
      role="img"
      aria-label={`${initials} Logo`}
    >
      {initials}
    </div>
  );
};

export default InitialLogo;
