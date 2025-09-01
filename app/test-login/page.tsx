'use client';

export default function TestLogin() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'black' }}>Test Login Page</h1>
      <p style={{ color: 'black' }}>If you can see this, the app is working.</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
}
