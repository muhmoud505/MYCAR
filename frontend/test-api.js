// Test API connection
const API_BASE = 'http://localhost:5000'

async function testConnection() {
  try {
    console.log('Testing API connection to:', API_BASE)
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE}/api/health`)
    const healthData = await healthResponse.json()
    console.log('Health check:', healthData)
    
    // Test auth endpoint (should return 401 without token)
    const authResponse = await fetch(`${API_BASE}/api/auth/me`)
    console.log('Auth endpoint status:', authResponse.status)
    
    if (authResponse.status === 401) {
      const authData = await authResponse.json()
      console.log('Auth endpoint response:', authData)
    }
    
    console.log('✅ API connection successful!')
  } catch (error) {
    console.error('❌ API connection failed:', error)
  }
}

// Run test
testConnection()
