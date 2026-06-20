/**
 * Centralized Profile Image Helper
 * 
 * This utility provides a consistent way to fetch employee profile images across the application.
 * Priority order:
 * 1. localStorage (most recent updates from Employee Profile edits)
 * 2. Backend employee data (emp.image)
 * 3. UI Avatars placeholder (fallback with employee initials)
 * 
 * Usage:
 * import { getEmployeeProfileImage } from '../utils/profileImageHelper';
 * 
 * <img src={getEmployeeProfileImage(employee)} alt="Profile" />
 */

// Helper to generate avatar color based on name
const getAvatarColor = (name) => {
  if (!name) return "cccccc";

  const colors = ["1abc9c", "3498db", "9b59b6", "e67e22", "e74c3c", "2ecc71"];
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash); 
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get employee profile image with fallback priority
 * @param {Object} employee - Employee object with employeeId, email, name, fullName, and optionally image
 * @returns {string} - Image URL (base64 data URL, HTTP URL, or UI Avatars URL)
 */
export const getEmployeeProfileImage = (employee) => {
  if (!employee) {
    return `https://ui-avatars.com/api/?name=Unknown&background=cccccc&color=fff&size=128`;
  }

  // Try to get employeeId or email to check localStorage
  const employeeId = employee.employeeId || employee.id || employee.empId;
  const employeeEmail = employee.email;
  
  // Priority 1: Check localStorage by employeeId
  if (employeeId) {
    const localStorageImage = localStorage.getItem(`employee-image-${employeeId}`);
    if (localStorageImage) {
      return localStorageImage;
    }
  }
  
  // Priority 2: Check localStorage by email (fallback)
  if (employeeEmail) {
    const localStorageImageByEmail = localStorage.getItem(`employee-image-${employeeEmail}`);
    if (localStorageImageByEmail) {
      return localStorageImageByEmail;
    }
  }
  
  // Priority 3: Use backend image if available
  if (employee.image) {
    return employee.image;
  }
  
  // Priority 4: Generate UI Avatars placeholder
  const name = employee.fullName || employee.name || employee.empName || employee.email?.split('@')[0] || "User";
  const color = getAvatarColor(name);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128`;
};

/**
 * Get employee profile image by email
 * Useful when you only have the email and need to fetch from localStorage
 * @param {string} email - Employee email
 * @param {string} fallbackName - Name to use for avatar placeholder if no image found
 * @returns {string} - Image URL
 */
export const getEmployeeProfileImageByEmail = (email, fallbackName = null) => {
  if (!email) {
    return `https://ui-avatars.com/api/?name=Unknown&background=cccccc&color=fff&size=128`;
  }
  
  // Check localStorage by email
  const localStorageImage = localStorage.getItem(`employee-image-${email}`);
  if (localStorageImage) {
    return localStorageImage;
  }
  
  // Fallback to UI Avatars
  const name = fallbackName || email.split('@')[0];
  const color = getAvatarColor(name);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128`;
};

/**
 * Get initials from name for avatar
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return "??";

  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Generate avatar color for consistency
 * @param {string} text - Text to generate color from (usually name or email)
 * @returns {string} - Hex color code
 */
export const generateAvatarColor = (text) => {
  if (!text) return "#6b7280";

  const colors = [
    "#2563eb",
    "#7c3aed",
    "#059669",
    "#ea580c",
    "#db2777",
    "#0ea5e9",
    "#16a34a",
    "#9333ea",
    "#f59e0b",
  ];

  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
