import axios from 'axios';
import Constants from 'expo-constants';

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
import {AuthenticationRequest, AuthenticationResponse, RegisterRequest, RegisterResponse} from "@/types/authenTypes";
import {showMessage} from "react-native-flash-message";

const API_BASE_URL = "https://sustainable-be.code4fun.xyz/api/v1/auth";

// This function simulates a delay to mimic network latency
const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const registerRequest = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/register`, {
      firstname,
      lastname,
      email,
      password,
    } as RegisterRequest);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const loginRequest = async (
    email: string,
    password: string
): Promise<AuthenticationResponse> => {
  try {
    const response = await axios.post<AuthenticationResponse>(`${API_BASE_URL}/authenticate`, {
      email,
      password,
    } as AuthenticationRequest);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const refreshTokenRequest = async (refreshToken: string): Promise<AuthenticationResponse> => {
  try {
    const response = await axios.post<AuthenticationResponse>(
        `${API_BASE_URL}/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Làm mới token thất bại');
  }
};

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
  };

  mockUsers[userIndex] = updatedUser;

  return updatedUser;
};