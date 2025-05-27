// Test script to register a new account via API
const axios = require('axios');

const API_BASE_URL = "https://sustainable-be.code4fun.xyz/api/v1/auth";

async function registerAccount() {
    const userData = {
        firstname: "Test",
        lastname: "User",
        email: "testuser@example.com",
        phoneNumber: "+1234567890",
        password: "TestPassword123!"
    };

    try {
        console.log('📝 Registering new account...');
        console.log('Request data:', JSON.stringify(userData, null, 2));

        const response = await axios.post(`${API_BASE_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ Registration successful!');
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log('❌ Registration failed!');
        console.log('Error status:', error.response?.status);
        console.log('Error message:', error.response?.data?.message || error.message);
        console.log('Full error response:', JSON.stringify(error.response?.data, null, 2));
    }
}

// Run the registration
registerAccount();
