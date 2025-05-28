/**
 * Utility functions for handling image URLs
 */

const IMAGE_BASE_URL = "https://code4fun.xyz/images/";

/**
 * Combines the base URL with the profile image URL name
 * @param profileImageUrl - The image filename or relative path
 * @returns Complete image URL or null if no image provided
 */
export const getProfileImageUrl = (
  profileImageUrl?: string | null
): string | null => {
  if (!profileImageUrl) {
    return null;
  }

  // If it's already a complete URL, return as is
  if (
    profileImageUrl.startsWith("http://") ||
    profileImageUrl.startsWith("https://")
  ) {
    return profileImageUrl;
  }

  // Combine base URL with the image filename
  return `${IMAGE_BASE_URL}${profileImageUrl}`;
};

/**
 * Gets the default avatar URL or returns null
 * @param name - User's name to generate initial
 * @returns null (to show placeholder)
 */
export const getDefaultAvatarUrl = (name?: string): null => {
  return null; // Let the UI handle placeholder rendering
};
