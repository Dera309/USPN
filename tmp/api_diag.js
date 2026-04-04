import axios from 'axios'

async function test() {
  try {
    console.log('--- LOGGING IN ---')
    const loginRes = await axios.post('http://localhost:5005/api/auth/login', {
      email: 'obia.colin.100@gmail.com',
      password: 'Password123!'
    })
    
    const token = loginRes.data.token
    const user = loginRes.data.user
    console.log('Login successful. User ID:', user._id)
    
    console.log('\n--- FETCHING SHIPMENTS ---')
    const shipmentRes = await axios.get('http://localhost:5005/api/shipments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Status:', shipmentRes.status)
    console.log('Data:', JSON.stringify(shipmentRes.data, null, 2))
    
    process.exit(0)
  } catch (err) {
    console.error('Test failed:', err.response?.data || err.message)
    process.exit(1)
  }
}

test()
