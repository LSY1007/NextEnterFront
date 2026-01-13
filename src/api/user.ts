import api from "./axios";

export interface UserProfile {
  userId: number;
  email: string;
  name: string;
  phone?: string;
  age?: number;
  gender?: string;
  profileImage?: string;
  bio?: string;
  provider?: string;
  createdAt?: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  age?: number;
  gender?: string;
  bio?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// 사용자 정보 조회
export const getUserProfile = async (
  userId: number
): Promise<ApiResponse<UserProfile>> => {
  const response = await api.get<ApiResponse<UserProfile>>(
    `/api/auth/user/${userId}` // ✅ /api/auth/user 로 수정
  );
  return response.data;
};

// 사용자 정보 수정
export const updateUserProfile = async (
  userId: number,
  data: UpdateUserRequest
): Promise<ApiResponse<UserProfile>> => {
  const response = await api.put<ApiResponse<UserProfile>>(
    `/api/auth/user/${userId}`, // ✅ /api/auth/user 로 수정
    data
  );
  return response.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (
  userId: number,
  file: File
): Promise<ApiResponse<{ profileImage: string }>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ApiResponse<{ profileImage: string }>>(
    `/api/auth/user/${userId}/profile-image`, // ✅ /api/auth/user 로 수정
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
