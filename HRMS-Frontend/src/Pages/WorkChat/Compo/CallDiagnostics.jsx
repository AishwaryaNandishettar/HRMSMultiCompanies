import React, { useState } from 'react';
import axios from '../../../api/axios';

/**
 * Call Diagnostics Component
 * Helps troubleshoot LiveKit connection issues
 */
const CallDiagnostics = ({ onClose }) => {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const testResults = {};

    // Test 1: Backend connectivity
    try {
      console.log('🔍 Testing backend connectivity...');
      const response = await axios.get('/api/livekit/config');
      testResults.backendConnectivity = {
        status: 'success',
        message: 'Backend is reachable',
        data: response.data
      };
    } catch (error) {
      testResults.backendConnectivity = {
        status: 'error',
        message: `Backend error: ${error.message}`,
        error: error.response?.data || error.message
      };
    }

    // Test 2: Token generation
    try {
      console.log('🔍 Testing token generation...');
      const response = await axios.get('/api/livekit/token', {
        params: { 
          meetingId: 'test-meeting-' + Date.now(),
          displayName: 'Test User'
        }
      });
      testResults.tokenGeneration = {
        status: 'success',
        message: 'Token generated successfully',
        data: response.data
      };
    } catch (error) {
      testResults.tokenGeneration = {
        status: 'error',
        message: `Token generation failed: ${error.message}`,
        error: error.response?.data || error.message
      };
    }

    // Test 3: LiveKit server connectivity (if we have a token)
    if (testResults.tokenGeneration?.status === 'success') {
      try {
        console.log('🔍 Testing LiveKit server connectivity...');
        const { token, url } = testResults.tokenGeneration.data;
        
        // Try to create a WebSocket connection to LiveKit
        const wsUrl = url.replace('ws://', '').replace('wss://', '');
        const testWs = new WebSocket(`ws://${wsUrl}`);
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            testWs.close();
            reject(new Error('Connection timeout'));
          }, 5000);

          testWs.onopen = () => {
            clearTimeout(timeout);
            testWs.close();
            resolve();
          };

          testWs.onerror = (error) => {
            clearTimeout(timeout);
            reject(error);
          };
        });

        testResults.livekitConnectivity = {
          status: 'success',
          message: 'LiveKit server is reachable',
          url: url
        };
      } catch (error) {
        testResults.livekitConnectivity = {
          status: 'error',
          message: `LiveKit server unreachable: ${error.message}`,
          error: error.message
        };
      }
    } else {
      testResults.livekitConnectivity = {
        status: 'skipped',
        message: 'Skipped due to token generation failure'
      };
    }

    // Test 4: Browser capabilities
    testResults.browserCapabilities = {
      status: 'info',
      message: 'Browser capabilities check',
      data: {
        webRTC: !!window.RTCPeerConnection,
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        webSocket: !!window.WebSocket,
        https: window.location.protocol === 'https:',
        localhost: window.location.hostname === 'localhost'
      }
    };

    setResults(testResults);
    setTesting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'skipped': return '⏭️';
      case 'info': return 'ℹ️';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'skipped': return '#FF9800';
      case 'info': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>📊 Call Diagnostics</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={runDiagnostics}
            disabled={testing}
            style={{
              backgroundColor: '#4a9eff',
              border: 'none',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: testing ? 'not-allowed' : 'pointer',
              opacity: testing ? 0.6 : 1
            }}
          >
            {testing ? '🔄 Running Tests...' : '🚀 Run Diagnostics'}
          </button>
        </div>

        {Object.keys(results).length > 0 && (
          <div>
            <h3>Test Results:</h3>
            
            {Object.entries(results).map(([testName, result]) => (
              <div key={testName} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
                borderLeft: `4px solid ${getStatusColor(result.status)}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px', marginRight: '8px' }}>
                    {getStatusIcon(result.status)}
                  </span>
                  <strong>{testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</strong>
                </div>
                
                <p style={{ margin: '0 0 8px 0', color: '#ddd' }}>{result.message}</p>
                
                {result.data && (
                  <details style={{ marginTop: '8px' }}>
                    <summary style={{ cursor: 'pointer', color: '#4a9eff' }}>View Details</summary>
                    <pre style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      padding: '10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      overflow: 'auto',
                      marginTop: '8px'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
                
                {result.error && (
                  <details style={{ marginTop: '8px' }}>
                    <summary style={{ cursor: 'pointer', color: '#ff6b6b' }}>View Error</summary>
                    <pre style={{
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      padding: '10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      overflow: 'auto',
                      marginTop: '8px',
                      color: '#ff6b6b'
                    }}>
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(74, 158, 255, 0.1)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>💡 Troubleshooting Tips:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>If backend connectivity fails: Check if backend is running on port 8082</li>
                <li>If token generation fails: Check authentication and LiveKit configuration</li>
                <li>If LiveKit server is unreachable: Start LiveKit server with: <code>livekit-server.exe --keys "devkey: devsecret12345678901234567"</code></li>
                <li>If browser capabilities are missing: Use Chrome/Firefox and ensure HTTPS or localhost</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallDiagnostics;