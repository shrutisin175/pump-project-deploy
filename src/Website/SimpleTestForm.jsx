import React, { useState } from 'react';

const SimpleTestForm = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Testing...');

    try {
      console.log('Testing backend connection...');
      const response = await fetch('http://localhost:8000/api/pump-spares/test-energy-optimization/');
      const data = await response.json();
      
      console.log('Backend response:', data);
      setMessage(`✅ Backend is working! Response: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Backend test failed:', error);
      setMessage(`❌ Backend test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🔧 Backend Connection Test</h1>
      
      <form onSubmit={handleTestSubmit}>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '8px'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Click "Test Backend Connection"</li>
          <li>Check browser console (F12) for logs</li>
          <li>If this works, the issue is in the main form</li>
          <li>If this fails, the issue is with backend connection</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleTestForm;
