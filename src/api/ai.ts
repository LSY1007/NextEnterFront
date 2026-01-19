import api from "./axios";

// ========================================
// AI 추천 요청 인터페이스
// ========================================
export interface ResumeContent {
  education?: Array<{
    degree: string;
    major: string;
    status: string;
  }>;
  skills: {
    essential: string[];
    additional: string[];
  };
  professional_experience?: Array<{
    company: string;
    period: string;
    role: string;
    key_tasks: string[];
  }>;
}

export interface AiRecommendRequest {
  id: string;
  target_role: string;
  resume_content: ResumeContent;
}

// ========================================
// AI 추천 응답 인터페이스
// ========================================
export interface CompanyInfo {
  company_name: string;
  role: string;
  score: number;
  match_level: "BEST" | "HIGH" | "LOW";
  is_exact_match: boolean;
}

export interface AiRecommendResponse {
  companies: CompanyInfo[];
  ai_report: string;
}

// ========================================
// API 호출 함수
// ========================================
export const getAiRecommendation = async (
  data: AiRecommendRequest
): Promise<AiRecommendResponse> => {
  const response = await api.post<AiRecommendResponse>(
    "/api/ai/resume/recommend",
    data
  );
  return response.data;
};
