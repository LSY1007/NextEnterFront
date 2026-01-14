import api from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  token: string;
  email: string;
  name: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  age?: number;
  gender?: string;
}

export interface SignupResponse {
  userId: number;
  email: string;
  name: string;
  age?: number;
  gender?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ✅ 로그인 - 객체를 받도록 수정
export const login = async (
  loginData: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/api/auth/login",
    loginData
  );
  return response.data;
};

// 로그아웃
export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/api/auth/logout");
  return response.data;
};

// 회원가입
export const signup = async (
  signupData: SignupRequest
): Promise<ApiResponse<SignupResponse>> => {
  const response = await api.post<ApiResponse<SignupResponse>>(
    "/api/auth/signup",
    signupData
  );
  return response.data;
};
