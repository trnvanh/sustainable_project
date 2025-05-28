export type UpdateUserProfileRequest = {
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
};

export type UserProfileResponse = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  role: string;
};
