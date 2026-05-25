
const axios = require('axios');

async function register() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'HR Tester',
      email: 'hr-tester@example.com',
      password: 'password123',
      role: 'hr'
    });
    console.log('HR registered:', res.data);
  } catch (err) {
    console.error('Registration failed:', err.response ? err.response.data : err.message);
  }
}

register();
