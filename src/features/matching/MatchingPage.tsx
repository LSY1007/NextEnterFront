import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getResumeList, getResumeDetail } from "../../api/resume";
import { getJobPostings } from "../../api/job";
import { getAiRecommendation, CompanyInfo } from "../../api/ai";
import { mapResumeToAiFormat } from "../../utils/resumeMapper";
import MatchingSidebar from "./components/MatchingSidebar";
import MatchingHistoryPage from "./components/MatchingHistoryPage";
import ConfirmDialog from "./components/ConfirmDialog";
import MatchingHeader from "./components/MatchingHeader";
import TargetSelection from "./components/TargetSelection";
import EmptyAnalysis from "./components/EmptyAnalysis";
import AnalysisResult from "./components/AnalysisResult";
import { useApp } from "../../context/AppContext";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import {
  SAMPLE_STRENGTHS,
  SAMPLE_WEAKNESSES,
  SAMPLE_TECH_SKILLS,
  SAMPLE_RECOMMENDATIONS,
  CREDIT_COST,
} from "./data/sampleData";

interface MatchingPageProps {
  onEditResume?: () => void;
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function MatchingPage({
  onEditResume,
  initialMenu = "matching",
  onNavigate,
}: MatchingPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // [Auto-Merge] Incoming 브랜치의 usePageNavigation 훅 사용 (사이드바 연동)
  const { activeMenu, handleMenuClick, setActiveMenu } = usePageNavigation(
    "matching",
    initialMenu || "matching-sub-1",
    onNavigate
  );

  const [selectedResume, setSelectedResume] = useState("");
  const [currentCredit, setCurrentCredit] = useState(200);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recommendedCompanies, setRecommendedCompanies] = useState<CompanyInfo[]>([]);
  const [aiReport, setAiReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Context에서 실제 데이터 가져오기 - 기업 공고 사용!
  const { resumes, businessJobs, addMatchingHistory, setResumes, setBusinessJobs } = useApp();

  // ✅ 이력서가 비어있으면 API에서 불러오기
  useEffect(() => {
    const loadResumesIfEmpty = async () => {
      if (resumes.length === 0 && user?.userId) {
        try {
          const data = await getResumeList(user.userId);
          if (Array.isArray(data) && data.length > 0) {
            const contextResumes = data.map((resume) => ({
              id: resume.resumeId,
              title: resume.title,
              industry: resume.jobCategory || '미지정',
              applications: 0,
            }));
            setResumes(contextResumes);
          }
        } catch (error) {
          console.error('이력서 로드 오류:', error);
        }
      }
    };

    loadResumesIfEmpty();
  }, [user?.userId, resumes.length, setResumes]);

  // ✅ 공고 목록 로딩 (백엔드 API에서 가져오기)
  useEffect(() => {
    const loadJobsIfEmpty = async () => {
      if (businessJobs.length === 0) {
        try {
          const response = await getJobPostings({ size: 100 });
          if (response.content && response.content.length > 0) {
            const jobs = response.content.map(job => ({
              id: job.jobId,
              title: job.title,
              status: job.status as "ACTIVE" | "CLOSED" | "EXPIRED",
              job_category: job.jobCategory,
              location: job.location,
              experience_min: job.experienceMin,
              experience_max: job.experienceMax,
              salary_min: job.salaryMin,
              salary_max: job.salaryMax,
              deadline: job.deadline,
              view_count: job.viewCount,
              applicant_count: job.applicantCount,
              bookmark_count: 0,
              created_at: job.createdAt
            }));
            setBusinessJobs(jobs);
          }
        } catch (error) {
          console.error('공고 로드 오류:', error);
        }
      }
    };

    loadJobsIfEmpty();
  }, [businessJobs.length, setBusinessJobs]);

  // 이력서를 TargetSelection에서 사용할 수 있는 형식으로 변환
  const resumeOptions = resumes.map((resume) => ({
    id: resume.id.toString(),
    name: resume.title,
  }));

  // 기업 공고를 TargetSelection에서 사용할 수 있는 형식으로 변환
  // ACTIVE 상태인 공고만 선택 가능하도록 필터링
  const jobOptions = businessJobs
    .filter((job) => job.status === "ACTIVE")
    .map((job) => ({
      id: job.id.toString(),
      name: job.title,
      company: job.job_category, // 직무 카테고리를 회사명처럼 표시
    }));

  const handleCreditClick = () => {
    // 크레딧 충전 페이지로 이동
    navigate('/user/credit/charge?menu=credit-sub-2');
  };

  const handleAnalyze = () => {
    try {
      if (!selectedResume) {
        alert("이력서를 먼저 선택해주세요!");
        return;
      }
      if (currentCredit < CREDIT_COST) {
        alert("크레딧이 부족합니다!");
        return;
      }
      // 확인 다이얼로그 표시
      setShowConfirmDialog(true);
    } catch (error) {
      console.error("분석 실행 중 오류:", error);
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleConfirmAnalysis = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);

    try {
      // 1. 선택된 이력서 정보 가져오기
      const selectedResumeInfo = resumes.find(
        (r) => r.id.toString() === selectedResume
      );

      if (!selectedResumeInfo || !user?.userId) {
        alert("이력서 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      // 2. 백엔드 API로 이력서 상세 조회
      const resumeData = await getResumeDetail(selectedResumeInfo.id, user.userId);

      // 3. NextEnterAI 형식으로 변환
      const aiRequest = mapResumeToAiFormat(resumeData, user.userId);

      // 4. AI 추천 API 호출
      const aiResult = await getAiRecommendation(aiRequest);

      // 5. 결과 저장 및 UI 표시
      setRecommendedCompanies(aiResult.companies);
      setAiReport(aiResult.ai_report);
      setHasAnalysis(true);
      setCurrentCredit(currentCredit - CREDIT_COST);

      // 6. 히스토리에 추가 (첫 번째 추천 기업 기준)
      if (aiResult.companies.length > 0) {
        const now = new Date();
        const date = now
          .toLocaleDateString("ko-KR")
          .replace(/\. /g, ".")
          .replace(".", "");
        const time = now.toTimeString().slice(0, 5);

        const topCompany = aiResult.companies[0];
        const historyId = Date.now();
        const newHistory = {
          id: historyId,
          date: date,
          time: time,
          resume: selectedResumeInfo.title,
          resumeId: selectedResumeInfo.id,
          company: topCompany.company_name,
          position: topCompany.role,
          jobId: 0, // AI 추천은 실제 jobId가 없음
          score: topCompany.score,
          suitable: topCompany.match_level === "BEST" || topCompany.match_level === "HIGH",
          techMatch: {},
          strengths: ["AI 기반 매칭"],
          improvements: ["상세 분석은 AI 리포트 참조"],
        };

        addMatchingHistory(newHistory);
      }
    } catch (error) {
      console.error("AI 매칭 오류:", error);
      alert("AI 분석 중 오류가 발생했습니다. NextEnterAI 서버가 실행 중인지 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAnalysis = () => {
    setShowConfirmDialog(false);
  };

  const handleAddResume = () => {
    // 이력서 작성 페이지로 이동
    navigate('/user/resume?menu=resume-sub-1');
  };


  const handleBackToMatching = () => {
    setActiveMenu("matching");
  };

  const handleReanalyze = () => {
    setHasAnalysis(false);
    setRecommendedCompanies([]);
    setAiReport("");
  };

  const handleEditResume = () => {
    // 이력서 수정 페이지로 이동
    navigate('/user/resume?menu=resume-sub-1');
  };

  const handleApply = () => {
    // 채용공고 목록 페이지로 이동
    navigate('/user/jobs/all?menu=job-sub-1');
  };

  // 히스토리 페이지 표시
  if (activeMenu === "history" || activeMenu === "matching-sub-2") {
    return (
      <MatchingHistoryPage
        onBackToMatching={handleBackToMatching}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
      />
    );
  }

  return (
    <>
      {/* 확인 다이얼로그 */}
      {showConfirmDialog && (
        <ConfirmDialog
          onConfirm={handleConfirmAnalysis}
          onCancel={handleCancelAnalysis}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <h2 className="inline-block mb-6 text-2xl font-bold">매칭현황</h2>
          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <MatchingSidebar
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1">
              {/* 상단 헤더 */}
              <MatchingHeader
                currentCredit={currentCredit}
                onCreditClick={handleCreditClick}
              />

              {/* 선택 카드 */}
              <TargetSelection
                resumes={resumeOptions}
                selectedResume={selectedResume}
                onResumeChange={setSelectedResume}
                onAddResume={handleAddResume}
                onAnalyze={handleAnalyze}
              />

              {/* 분석 결과 영역 */}
              {!hasAnalysis ? (
                <EmptyAnalysis />
              ) : isLoading ? (
                <div className="p-12 text-center bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl font-bold text-gray-700">AI가 분석 중입니다...</p>
                    <p className="text-gray-500">이력서를 분석하고 최적의 기업을 찾고 있습니다.</p>
                  </div>
                </div>
              ) : (
                <AnalysisResult
                  recommendedCompanies={recommendedCompanies}
                  aiReport={aiReport}
                  onReanalyze={handleReanalyze}
                  onEditResume={handleEditResume}
                  onApply={handleApply}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
