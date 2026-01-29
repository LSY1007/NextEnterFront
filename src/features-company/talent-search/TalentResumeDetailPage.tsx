import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPublicResumeDetail, ResumeResponse } from "../../api/resume";
import { contactTalent } from "../../api/talent";

export default function TalentResumeDetailPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resume, setResume] = useState<ResumeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // resumeId가 없으면 목록으로 리다이렉트
    if (!resumeId) {
      navigate("/company/talent-search");
      return;
    }

    // user가 없으면 로딩 상태 유지
    if (!user?.userId) {
      return;
    }

    // 데이터 로딩
    loadResumeDetail();
  }, [resumeId, user?.userId]); // 의존성 배열을 명확하게 설정

  const loadResumeDetail = async () => {
    if (!resumeId || !user?.userId) return;

    try {
      setIsLoading(true);
      setError("");
      
      const data = await getPublicResumeDetail(parseInt(resumeId), user.userId);
      console.log("이력서 데이터:", data);
      setResume(data);
    } catch (err: any) {
      console.error("이력서 조회 오류:", err);
      setError(err.response?.data?.message || "이력서를 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = async () => {
    if (!user?.userId || !resumeId) return;
    
    const message = prompt("인재에게 보낼 메시지를 입력하세요:");
    if (!message) return;
    
    try {
      await contactTalent(parseInt(resumeId), message, user.userId);
      alert("스카우트 제안이 전송되었습니다!");
    } catch (error: any) {
      alert(error.response?.data?.message || "스카우트 제안에 실패했습니다.");
    }
  };

  // 스킬 데이터를 안전하게 파싱하는 함수
  const parseSkills = (skillsData: any): string[] => {
    if (!skillsData) return [];
    
    // 이미 배열이면 그대로 반환
    if (Array.isArray(skillsData)) {
      return skillsData;
    }
    
    // 문자열이면 JSON 파싱 시도
    if (typeof skillsData === 'string') {
      try {
        const parsed = JSON.parse(skillsData);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("스킬 파싱 오류:", e);
        return [];
      }
    }
    
    return [];
  };

  // structuredData를 안전하게 파싱하는 함수
  const parseStructuredData = (data: any) => {
    if (!data) return {};
    
    if (typeof data === 'object') return data;
    
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("structuredData 파싱 오류:", e);
        return {};
      }
    }
    
    return {};
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="p-8 text-center bg-white border border-red-200 rounded-lg">
          <div className="mb-4 text-4xl">❌</div>
          <p className="mb-4 text-lg text-red-600">{error || "이력서를 찾을 수 없습니다."}</p>
          <button
            onClick={() => navigate("/company/talent-search")}
            className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 데이터 안전하게 파싱
  const skills = parseSkills(resume.skills);
  const sections = parseStructuredData(resume.structuredData);
  const personalInfo = sections.personalInfo || {};

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/company/talent-search")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <span>←</span>
          <span>목록으로 돌아가기</span>
        </button>
      </div>

      {/* 메인 카드 */}
      <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* 프로필 헤더 */}
        <div className="flex items-start justify-between pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 text-3xl font-bold text-white bg-purple-500 rounded-full">
              {personalInfo?.name?.charAt(0) || "이"}
            </div>
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {personalInfo?.name || "이상연"}
              </h1>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span>👤</span>
                  <span>{personalInfo?.email || "이메일 미등록"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📱</span>
                  <span>{personalInfo?.phone || "연락처 미등록"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{personalInfo?.birthDate || "생년월일 미등록"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-6xl font-bold text-purple-600">0</div>
            <div className="mt-2 text-sm text-gray-500">AI 매칭 점수</div>
          </div>
        </div>

        {/* 지원 정보 */}
        <div className="p-6 mb-6 border-2 border-blue-200 rounded-lg bg-blue-50">
          <h2 className="mb-4 text-xl font-bold text-gray-900">지원 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-2 text-sm font-medium text-gray-600">지원 공고</div>
              <div className="text-base text-gray-900">{resume.title || "-"}</div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-gray-600">직무</div>
              <div className="text-base text-gray-900">{resume.jobCategory || "-"}</div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-gray-600">지원일</div>
              <div className="text-base text-gray-900">
                {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString('ko-KR') : "2026. 1. 28."}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-gray-600">갱신일</div>
              <div className="text-base text-gray-900">
                {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString('ko-KR') : "2026. 1. 28."}
              </div>
            </div>
          </div>
        </div>

        {/* 인적사항 */}
        <div className="p-6 mb-6 border-2 border-red-200 rounded-lg bg-red-50">
          <h2 className="mb-4 text-xl font-bold text-gray-900">📋 인적사항</h2>
          {personalInfo && Object.keys(personalInfo).length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {personalInfo.gender && (
                <div className="p-4 bg-white border border-red-200 rounded-lg">
                  <div className="mb-1 text-sm font-medium text-gray-600">성별</div>
                  <div className="text-base text-gray-900">{personalInfo.gender}</div>
                </div>
              )}
              {personalInfo.birthDate && (
                <div className="p-4 bg-white border border-red-200 rounded-lg">
                  <div className="mb-1 text-sm font-medium text-gray-600">생년월일</div>
                  <div className="text-base text-gray-900">{personalInfo.birthDate}</div>
                </div>
              )}
              {personalInfo.address && (
                <div className="col-span-2 p-4 bg-white border border-red-200 rounded-lg">
                  <div className="mb-1 text-sm font-medium text-gray-600">주소</div>
                  <div className="text-base text-gray-900">{personalInfo.address}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 bg-white border border-red-200 rounded-lg">
              인적사항 정보가 없습니다.
            </div>
          )}
        </div>

        {/* 주요 스킬 */}
        <div className="p-6 mb-6 border-2 border-purple-200 rounded-lg bg-purple-50">
          <h2 className="mb-4 text-xl font-bold text-gray-900">📘 주요 스킬</h2>
          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 font-medium text-purple-700 bg-white border border-purple-300 rounded-lg"
                >
                  {skill}
                </span>
              ))
            ) : (
              <>
                <span className="px-4 py-2 font-medium text-purple-700 bg-white border border-purple-300 rounded-lg">
                  JAVA
                </span>
                <span className="px-4 py-2 font-medium text-purple-700 bg-white border border-purple-300 rounded-lg">
                  Python
                </span>
                <span className="px-4 py-2 font-medium text-purple-700 bg-white border border-purple-300 rounded-lg">
                  JavaScript
                </span>
                <span className="px-4 py-2 font-medium text-purple-700 bg-white border border-purple-300 rounded-lg">
                  TypeScript
                </span>
              </>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handleContact}
            className="flex-1 px-6 py-3 font-semibold text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            스카우트 제안
          </button>
          <button
            onClick={() => alert("적합성 상세 기능은 준비 중입니다.")}
            className="flex-1 px-6 py-3 font-semibold text-gray-700 transition bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50"
          >
            적합성 상세
          </button>
        </div>
      </div>
    </div>
  );
}