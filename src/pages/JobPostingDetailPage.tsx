import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { getJobPosting, deleteJobPosting, type JobPostingResponse } from "../api/job";

export default function JobPostingDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { isAuthenticated, user, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobPostingResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 공고 데이터 로드
  useEffect(() => {
    const loadJobPosting = async () => {
      if (!jobId) {
        alert("잘못된 접근입니다.");
        navigate("/company/jobs");
        return;
      }

      try {
        setLoading(true);
        const jobData = await getJobPosting(parseInt(jobId));
        setJob(jobData);
      } catch (error: any) {
        console.error("공고 조회 실패:", error);
        alert(error.response?.data?.message || "공고를 불러오는데 실패했습니다.");
        navigate("/company/jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobPosting();
  }, [jobId, navigate]);

  const handleBackClick = () => {
    navigate("/company/jobs");
  };

  const handleLogoClick = () => {
    navigate("/company");
  };

  const handleEditClick = () => {
    if (jobId) {
      navigate(`/company/jobs/edit/${jobId}`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobId || !user?.companyId) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    try {
      await deleteJobPosting(parseInt(jobId), user.companyId);
      alert("공고가 삭제되었습니다.");
      setShowDeleteConfirm(false);
      navigate("/company/jobs");
    } catch (error: any) {
      console.error("공고 삭제 실패:", error);
      alert(error.response?.data?.message || "공고 삭제에 실패했습니다.");
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "진행중";
      case "CLOSED":
        return "마감";
      case "EXPIRED":
        return "기간만료";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-gray-100 text-gray-700";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatExperience = (min?: number, max?: number) => {
    if (min === undefined && max === undefined) return "경력무관";
    if (min === 0) return "신입";
    if (max === undefined) return `${min}년 이상`;
    return `${min}~${max}년`;
  };

  const formatSalary = (min?: number, max?: number) => {
    if (min === undefined && max === undefined) return "협의";
    if (min === max) return `${min?.toLocaleString()}만원`;
    return `${min?.toLocaleString()} ~ ${max?.toLocaleString()}만원`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">공고를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div
              onClick={handleLogoClick}
              className="transition-opacity cursor-pointer hover:opacity-80"
            >
              <span className="text-2xl font-bold text-blue-600">Next </span>
              <span className="text-2xl font-bold text-blue-800">Enter</span>
            </div>

            {/* 네비게이션 */}
            <nav className="flex space-x-8">
              <button 
                onClick={() => navigate("/company/jobs")}
                className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700"
              >
                ■ 채용공고
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                자료
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                홍보
              </button>
            </nav>

            {/* 오른쪽 버튼 */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user?.userType === "company" ? (
                <>
                  <span className="text-gray-700 font-medium">
                    {user.companyName || user.name}님
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/company/login");
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/company/login")}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => navigate("/company/signup")}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    회원가입
                  </button>
                </>
              )}
              <button
                onClick={() => navigate("/user")}
                className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* 상단: 뒤로가기 & 제목 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackClick}
              className="text-2xl text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <span
              className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                job.status
              )}`}
            >
              {getStatusText(job.status)}
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEditClick}
              className="px-6 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              수정
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={job.status === "CLOSED" || job.status === "EXPIRED"}
              className={`px-6 py-2 font-semibold text-white transition rounded-lg ${
                job.status === "CLOSED" || job.status === "EXPIRED"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              삭제
            </button>
          </div>
        </div>

        {/* 주요 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="mb-1 text-sm text-gray-500">조회수</div>
            <div className="text-3xl font-bold text-gray-900">
              {job.viewCount}
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="mb-1 text-sm text-gray-500">지원자</div>
            <div className="text-3xl font-bold text-blue-600">
              {job.applicantCount}
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="mb-1 text-sm text-gray-500">북마크</div>
            <div className="text-3xl font-bold text-orange-600">
              {job.bookmarkCount}
            </div>
          </div>
        </div>

        {/* 공고 기본 정보 */}
        <div className="p-8 mb-6 bg-white rounded-lg shadow">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">공고 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-1 text-sm text-gray-500">회사명</div>
              <div className="text-base font-medium text-gray-900">
                {job.companyName}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">직무</div>
              <div className="text-base font-medium text-gray-900">
                {job.jobCategory}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">근무지</div>
              <div className="text-base font-medium text-gray-900">
                {job.location}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">경력</div>
              <div className="text-base font-medium text-gray-900">
                {formatExperience(job.experienceMin, job.experienceMax)}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">급여</div>
              <div className="text-base font-medium text-gray-900">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">등록일</div>
              <div className="text-base font-medium text-gray-900">
                {job.createdAt}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">마감일</div>
              <div className="text-base font-medium text-gray-900">
                {job.deadline}
              </div>
            </div>
          </div>
        </div>

        {/* 공고 설명 */}
        {job.description && (
          <div className="p-8 mb-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">공고 설명</h2>
            <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        )}

        {/* 필수 스킬 */}
        {job.requiredSkills && (
          <div className="p-8 mb-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">필수 스킬</h2>
            <div className="leading-relaxed text-gray-700 whitespace-pre-wrap">
              {job.requiredSkills}
            </div>
          </div>
        )}

        {/* 우대 스킬 */}
        {job.preferredSkills && (
          <div className="p-8 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">우대 스킬</h2>
            <div className="leading-relaxed text-gray-700 whitespace-pre-wrap">
              {job.preferredSkills}
            </div>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
            <h3 className="mb-2 text-lg font-bold text-gray-900">공고 삭제</h3>
            <p className="mb-6 text-gray-600">
              정말로 이 공고를 삭제하시겠습니까?<br />
              공고 상태가 "마감"으로 변경되며, 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
