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
    console.log(
      "Making API request to update profile with token:",
      token ? "Token exists" : "Token missing"
    );
    console.log("API URL being used:", `${API_BASE_URL}/profile`);
    console.log("Profile data being sent:", JSON.stringify(profileData));

    // First, verify the API connection is working by requesting the current profile
    try {
      await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 5000, // 5 seconds timeout to detect connection issues
      });
      console.log("Connection test successful, proceeding with update");
    } catch (testError: any) {
      console.error("Connection test failed:", testError.message);
      if (!testError.response) {
        // If no response, it's likely a network issue
        throw new Error(
          "Network connection failed. Please check your internet connection."
        );
      }
    }

    // Proceed with the update request
    const response = await axios.put<UserProfileResponse>(
      `${API_BASE_URL}/profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    console.log(
      "Update profile API response:",
      response.status,
      response.statusText
    );
    return response.data;
  } catch (error: any) {
    console.error("Update profile API error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // More specific error messages based on the error type
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timed out. The server might be slow or unreachable."
      );
    } else if (!error.response) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    } else if (error.response.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response.status === 403) {
      throw new Error("You don't have permission to update this profile.");
    } else if (error.response.status === 404) {
      throw new Error("User profile not found.");
    } else {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
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
