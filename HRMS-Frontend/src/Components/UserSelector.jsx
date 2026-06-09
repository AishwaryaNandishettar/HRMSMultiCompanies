import React from 'react';
import { useUser } from '../Context/UserContext';

const UserSelector = () => {
  const { currentUser, setCurrentUser, userRole, USER_ROLES } = useUser();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#374151'
      }}>
        🔐 Current User
      </div>
      
      <select
        value={currentUser}
        onChange={(e) => setCurrentUser(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          marginBottom: '12px'
        }}
      >
        {Object.keys(USER_ROLES).map(username => (
          <option key={username} value={username}>
            {USER_ROLES[username].name} ({USER_ROLES[username].role})
          </option>
        ))}
      </select>

      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        background: '#f9fafb',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}>
        <div><strong>Phone:</strong> {userRole?.phone}</div>
        <div><strong>Email:</strong> {userRole?.email}</div>
        <div><strong>Permissions:</strong></div>
        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
          {userRole?.permissions.map(perm => (
            <li key={perm} style={{ fontSize: '11px' }}>
              {perm.replace(/_/g, ' ').toLowerCase()}
            </li>
          ))}
        </ul>
      </div>

      <div style={{
        fontSize: '11px',
        color: '#9ca3af',
        marginTop: '8px',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Switch users to test permissions
      </div>
    </div>
  );
};

export default UserSelector;