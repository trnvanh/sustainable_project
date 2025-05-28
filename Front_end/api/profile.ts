import {
  UpdateUserProfileRequest,
  UserProfileResponse,
} from "@/types/profileTypes";
import axios from "axios";

const API_BASE_URL = "https://sustainable-be.code4fun.xyz/api/v1/users";

// Get current user profile
export const getUserProfile = async (
  token: string
): Promise<UserProfileResponse> => {
  try {
    const response = await axios.get<UserProfileResponse>(
      `${API_BASE_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to get user profile"
    );
  }
};

// Update user profile
export const updateUserProfile = async (
  token: string,
  profileData: UpdateUserProfileRequest
): Promise<UserProfileResponse> => {
  try {
    const response = await axios.put<UserProfileResponse>(
      `${API_BASE_URL}/profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

// Upload profile image
export const uploadProfileImage = async (
  token: string,
  imageFile: File | Blob
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axios.post<string>(
      `${API_BASE_URL}/profile/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
};
