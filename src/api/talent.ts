import api from "./axios";

const API_BASE_URL = "/api/resume";

// 인재 검색 응답 타입
export interface TalentSearchResponse {
  resumeId: number;
  userId: number;
  name: string; // 마스킹된 이름
  jobCategory: string;
  skills: string[];
  location: string;
  experienceYears: number;
  salaryRange: string;
  matchScore: number;
  isAvailable: boolean;
  viewCount: number;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// ✅ 인재 검색 - 공개된 이력서만 가져오기
export const searchTalents = async (params?: {
  jobCategory?: string;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<TalentSearchResponse>> => {
  console.log("🔍 [인재검색] 검색 파라미터:", params);
  
  try {
    // 백엔드에 /api/resume/search 엔드포인트가 있다면 사용
    console.log("🚀 [인재검색] /api/resume/search 호출 시도...");
    const response = await api.get(`${API_BASE_URL}/search`, { params });
    console.log("✅ [인재검색] 검색 결과:", response.data);
    return response.data;
  } catch (error: any) {
    // 엔드포인트가 없다면 /api/resume/public을 시도
    console.log("⚠️ [인재검색] search 엔드포인트 실패, public 엔드포인트 시도:", error.response?.status);
    try {
      console.log("🚀 [인재검색] /api/resume/public 호출 시도...");
      const response = await api.get(`${API_BASE_URL}/public`, { params });
      console.log("✅ [인재검색] public 결과:", response.data);
      return response.data;
    } catch (publicError: any) {
      console.error("❌ [인재검색] public 엔드포인트도 실패:", publicError.response?.status, publicError.response?.data);
      // 임시로 빈 결과 반환
      console.log("🚧 [인재검색] 빈 결과 반환");
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: params?.size || 20,
        number: params?.page || 0,
      };
    }
  }
};
