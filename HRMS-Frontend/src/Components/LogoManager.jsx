/**
 * Logo Manager Component
 * Attempts to load custom logo, falls back to InitialLogo if unavailable
 * NO BUSINESS LOGIC - Only visual branding
 */

import React, { useState } from 'react';
import InitialLogo from './InitialLogo';
import { useTheme } from '../Context/ThemeContext';

/**
 * LogoManager Component
 * @param {Object} props - Component props
 * @param {string} props.logoPath - Path to logo image file
 * @param {string} props.fallbackInitials - Initials to display if logo fails to load
 * @param {string} props.backgroundColor - Background color for fallback logo
 * @param {number} props.size - Logo size in pixels (48 for navigation, 120 for login)
 * @param {string} props.alt - Alt text for logo image
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} - Logo element (image or initials)
 */
const LogoManager = ({ 
  logoPath, 
  fallbackInitials,
  backgroundColor,
  size = 48,
  alt,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();

  // Use theme values if not provided as props
  const initials = fallbackInitials || theme.initials;
  const bgColor = backgroundColor || theme.colors.primary;
  const altText = alt || `${theme.companyName} Logo`;

  /**
   * Handles image load error - displays InitialLogo as fallback
   */
  const handleImageError = () => {
    console.warn(`[LogoManager] Failed to load logo image: ${logoPath}. Using InitialLogo fallback.`);
    setImageError(true);
  };

  /**
   * Handles successful image load
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // If image failed to load or path is invalid, show InitialLogo
  if (!logoPath || imageError) {
    return (
      <InitialLogo
        initials={initials}
        backgroundColor={bgColor}
        size={size}
        className={className}
      />
    );
  }

  // Show InitialLogo while image is loading (prevents flash)
  if (!imageLoaded) {
    return (
      <>
        <InitialLogo
          initials={initials}
          backgroundColor={bgColor}
          size={size}
          className={className}
        />
        <img
          src={logoPath}
          alt={altText}
          style={{ display: 'none' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </>
    );
  }

  // Display loaded image
  const imageStyle = {
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain',
    borderRadius: '8px',
    flexShrink: 0
  };

  return (
    <img
      src={logoPath}
      alt={altText}
      className={`logo-image ${className}`}
      style={imageStyle}
      onError={handleImageError}
    />
  );
};

export default LogoManager;
