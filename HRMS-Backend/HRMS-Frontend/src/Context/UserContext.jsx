import React, { createContext, useContext, useState, useEffect } from 'react';

// ✅ User roles and permissions configuration mapped to actual emails
const USER_ROLES = {
  'padmanabh': {
    phone: '9663743316',
    email: 'padmanabhan95@gmail.com',
    name: 'Padmanabh',
    role: 'HR Manager',
    permissions: ['UPDATE_ALL_CANDIDATES'], // Can update any candidate
    canUpdateCandidateIds: 'ALL' // Special permission for all candidates
  },
  'aishwarya': {
    phone: '9606408912', 
    email: 'aishushettar95@gmail.com',
    name: 'Aishwarya',
    role: 'HR Executive',
    permissions: ['UPDATE_OWN_CANDIDATES'],
    canUpdateCandidateIds: [] // Will be populated with specific candidate IDs
  },
  'mahesh': {
    phone: '9731465226',
    email: 'mahesh.ganga754@gmail.com',
    name: 'Mahesh', 
    role: 'HR Executive',
    permissions: ['UPDATE_OWN_CANDIDATES'],
    canUpdateCandidateIds: [] // Will be populated with specific candidate IDs
  }
};

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState('padmanabh'); // Default to Padmanabh for demo
  const [userRole, setUserRole] = useState(USER_ROLES.padmanabh);

  // ✅ Simulate user selection (in real app, this would come from authentication)
  useEffect(() => {
    const userData = USER_ROLES[currentUser];
    setUserRole(userData);
  }, [currentUser]);

  // ✅ Check if user can update a specific candidate based on email
  const canUpdateCandidate = (candidateEmail) => {
    if (!userRole) return false;
    
    // Padmanabh can update all candidates
    if (userRole.canUpdateCandidateIds === 'ALL') {
      return true;
    }
    
    // Other users can only update their own email record
    return userRole.email === candidateEmail;
  };

  // ✅ Get user data by phone number
  const getUserByPhone = (phone) => {
    return Object.values(USER_ROLES).find(user => user.phone === phone);
  };

  // ✅ Get user data by email
  const getUserByEmail = (email) => {
    return Object.values(USER_ROLES).find(user => user.email === email);
  };

  const value = {
    currentUser,
    setCurrentUser,
    userRole,
    USER_ROLES,
    canUpdateCandidate,
    getUserByPhone,
    getUserByEmail
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;