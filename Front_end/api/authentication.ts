// import axios from 'axios';

// export const loginRequest = async (username: string, password: string) => {
//   const response = await axios.post('/api/login', { username, password });
//   return response.data;
// };

// export const logoutRequest = async () => {
//   const response = await axios.post('/api/logout');
//   return response.data;
// };

// Using mock data for login for testing purposes
import { mockUsers } from '@/mocks/data/users';

// This function simulates a delay to mimic network latency
const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// This function simulates a login request
export const loginRequest = async (email: string, password: string) => {
  await simulateDelay(500);
  const foundUser = mockUsers.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    throw new Error('Invalid email or password');
  }

  return { email: foundUser.email, name: foundUser.name };
};

// This function simulates a registration request
export const registerRequest = async (
  fullName: string,
  email: string,
  password: string
) => {
  await simulateDelay(500);
  const exists = mockUsers.some((user) => user.email === email);

  if (exists) {
    throw new Error('Email already exists');
  }

  mockUsers.push({ email, password, name: fullName });

  return { email, name: fullName };
};
