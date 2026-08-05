import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * HR Contacts Display Component
 * Shows the HR team contact numbers that receive SMS notifications
 */
export default function HrContactsDisplay() {
  const [contacts, setContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    // Fetch HR contact information from backend
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/jobs/hr-contacts`
        );
        setContacts(response.data.contacts || []);
      } catch (error) {
        console.error('Failed to fetch HR contacts:', error);
        // Fallback data if API fails
        setContacts([
          { name: "Padmanabh", phone: "9663743316", role: "HR Manager" },
          { name: "Aishwarya", phone: "9606408912", role: "HR Executive" }
        ]);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Toggle Button */}
      <button
        onClick={() => setShowContacts(!showContacts)}
        style={{
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(22, 163, 74, 0.3)';
        }}
      >
        📱 HR SMS Contacts
        <span style={{
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          transform: showContacts ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>

      {/* Contact Cards Dropdown */}
      {showContacts && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          zIndex: 1000,
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e5e7eb',
          padding: '16px',
          marginTop: '8px',
          minWidth: '320px'
        }}>
          
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
              📱 HR Team - SMS Notifications
            </h4>
            <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.9 }}>
              Automatic SMS alerts for all recruitment status changes
            </p>
          </div>

          {/* Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contacts.map((contact, index) => (
              <div key={index} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                
                {/* Avatar */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: index === 0 ? '#dbeafe' : '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  {index === 0 ? '👨‍💼' : '👩‍💼'}
                </div>

                {/* Contact Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '2px'
                  }}>
                    {contact.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    marginBottom: '4px'
                  }}>
                    {contact.role}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    color: '#374151',
                    fontWeight: '600'
                  }}>
                    📞 {contact.phone}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/91${contact.phone}?text=Hi%20${encodeURIComponent(contact.name)}%2C%20regarding%20recruitment%20updates...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#dcfce7',
                      color: '#16a34a',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    💬 WhatsApp
                  </a>

                  {/* SMS */}
                  <a
                    href={`sms:${contact.phone}?body=Hi%20${encodeURIComponent(contact.name)}%2C%20regarding%20recruitment...`}
                    style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📱 SMS
                  </a>

                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#166534',
            textAlign: 'center'
          }}>
            ✅ <strong>Auto SMS:</strong> These contacts receive automatic SMS notifications whenever recruitment status is updated via the system
          </div>

        </div>
      )}
    </div>
  );
}