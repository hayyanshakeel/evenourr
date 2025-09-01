// Quick fix for admin dashboard token issues
// Run this in the browser console

console.log('🔧 Admin Dashboard Token Fix Tool');
console.log('=====================================');

// Check current tokens
const currentToken = localStorage.getItem('evenour_admin_token') || localStorage.getItem('admin_token');
console.log('Current token:', currentToken ? 'Present' : 'Missing');

if (currentToken) {
  try {
    const payload = JSON.parse(atob(currentToken));
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    
    console.log('Token details:');
    console.log('- Username:', payload.username);
    console.log('- Role:', payload.role);
    console.log('- Expires:', new Date(payload.exp * 1000).toLocaleString());
    console.log('- Is Expired:', isExpired);
    
    if (isExpired) {
      console.log('🚨 Token is expired! Getting new token...');
    }
  } catch (e) {
    console.log('🚨 Invalid token format! Getting new token...');
  }
}

// Auto-fix: Get fresh token
async function refreshToken() {
  try {
    console.log('🔄 Getting fresh admin token...');
    
    const response = await fetch('https://evenour-admin-auth.evenour-in.workers.dev/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'Hayyaan123@1'
      })
    });
    
    const result = await response.json();
    
    if (result.success && result.token) {
      localStorage.setItem('evenour_admin_token', result.token);
      localStorage.setItem('admin_token', result.token); // Backup storage
      console.log('✅ Fresh token obtained and stored!');
      console.log('🔄 Please refresh the page now.');
      
      // Auto refresh page after 2 seconds
      setTimeout(() => {
        location.reload();
      }, 2000);
      
      return result.token;
    } else {
      console.error('❌ Failed to get token:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Auto-run the fix
refreshToken();
