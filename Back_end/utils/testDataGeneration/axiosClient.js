import axios from 'axios';

export const client = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

async function authenticate(email, password) {
    try {
        // Register user first (ignore errors if already exists)
        try {
            await client.post('/api/v1/auth/register', {
                firstname: 'Admin',
                lastname: 'User',
                email,
                password,
                role: 'ADMIN'
            });
        } catch (regErr) {
            console.log('ℹ️ Registration skipped or failed:', regErr.response?.data?.message || regErr.message);
        }

        // Authenticate
        const response = await client.post('/api/v1/auth/authenticate', {
            email,
            password
        });

        const token = response.data?.accessToken;
        if (!token) {
            throw new Error('Authentication failed - no token received');
        }

        // Set token
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Authenticated successfully');
        return token;
    } catch (error) {
        console.error('Authentication failed:', error.response?.data || error.message);
        throw error;
    }
}

export {authenticate};

