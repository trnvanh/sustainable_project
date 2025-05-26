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
import { UserProfile } from '@/types/user';

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

  return foundUser;
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

  const newUserId = `u00${mockUsers.length + 1}`;

  const newUser = {
    id: newUserId,
    name: fullName,
    email,
    password,
    phone: '',
    credits: 0,
    rescuedMeals: 0,
    co2SavedKg: 0,
    moneySavedEur: 0,
    historyOrderIds: [],
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
    } as const,
    favorites: {
      items: [],
      stores: [],
    },
  };

  mockUsers.push(newUser);
  return newUser; // Return full user object
};

// This function simulates a user profile update request
export const updateUserRequest = async (
  userId: string,
  updatedFields: Partial<UserProfile>
): Promise<UserProfile> => {
  await simulateDelay(500);

  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Merge updates
  const updatedUser = {
    ...mockUsers[userIndex],
    ...updatedFields,
    preferences: {
      ...mockUsers[userIndex].preferences,
      ...updatedFields.preferences,
    },
    favorites: {
      ...mockUsers[userIndex].favorites,
      ...updatedFields.favorites,
    },
  };

  mockUsers[userIndex] = updatedUser;

  return updatedUser;
};