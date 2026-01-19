import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { getJobPostings, deleteJobPosting, type JobPostingListResponse } from "../api/job";

export default function JobManagementPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPostingListResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // 공고 목록 로드
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        
        // API 호출 파라미터 구성
        const params: any = {
          page: currentPage,
          size: 20,
        };

        // 카테고리 필터 (현재는 사용하지 않음)
        // if (selectedStatus !== "전체") {
        //   params.status = selectedStatus;
        // }

        // 검색 키워드
        if (searchQuery) {
          params.keyword = searchQuery;
        }

        const response = await getJobPostings(params);
        setJobs(response.content);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        console.error("공고 목록 조회 실패:", error);
        alert(error.response?.data?.message || "공고 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [currentPage, searchQuery]);

  const handleNewJob = () => {
    navigate("/company/jobs/create");
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/company/jobs/${jobId}`);
  };

  const handleEdit = (jobId: number) => {
    navigate(`/company/jobs/edit/${jobId}`);
  };

  const handleClose = async (jobId: number) => {
    const job = jobs.find((j) => j.jobId === jobId);
    if (!job) return;

    if (job.status === "CLOSED") {
      alert("이미 마감된 공고입니다.");
      return;
    }

    if (!user?.companyId) {
      alert("기업 정보를 찾을 수 없습니다.");
      return;
    }

    if (
      window.confirm(
        `"${job.title}" 공고를 마감하시겠습니까?\n\n` +
          `현재 지원자: ${job.applicantCount}명\n` +
          `마감 후에는 다시 활성화할 수 없습니다.`
      )
    ) {
      try {
        await deleteJobPosting(jobId, user.companyId);
        alert("공고가 마감되었습니다.");
        
        // 목록 새로고침
        const response = await getJobPostings({
          page: currentPage,
          size: 20,
          keyword: searchQuery || undefined,
        });
        setJobs(response.content);
      } catch (error: any) {
        console.error("공고 마감 실패:", error);
        alert(error.response?.data?.message || "공고 마감에 실패했습니다.");
      }
    }
  };

  const handleLogoClick = () => {
    navigate("/company");
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
        return "bg-gray-100 text-gray-600";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
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

  // 평균 점수 계산 (임시로 랜덤 값 사용)
  const calculateAverageScore = (applicantCount: number) => {
    if (applicantCount === 0) return 0;
    return (80 + Math.random() * 15).toFixed(1);
  };

  // 필터링 (클라이언트 측)
  const filteredJobs = jobs.filter((job) => {
    const statusMatch =
      selectedStatus === "전체" ||
      (selectedStatus === "진행중" && job.status === "ACTIVE") ||
      (selectedStatus === "마감" && job.status === "CLOSED") ||
      (selectedStatus === "기간만료" && job.status === "EXPIRED");

    const regionMatch =
      selectedRegion === "전체" || 
      (selectedRegion === "서울 전체" && job.location.startsWith("서울")) ||
      job.location.includes(selectedRegion);

    return statusMatch && regionMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div
              onClick={() => navigate("/company")}
              className="flex items-center space-x-2 transition-opacity cursor-pointer hover:opacity-80"
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
                  <button
                    onClick={() => navigate("/user")}
                    className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    개인 회원
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
                  <button
                    onClick={() => navigate("/user")}
                    className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    개인 회원
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* 타이틀과 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">공고 관리</h1>
          <button
            onClick={handleNewJob}
            className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            + 새 공고 등록
          </button>
        </div>

        {/* 필터 섹션 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              상태
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="진행중">진행중</option>
              <option value="마감">마감</option>
              <option value="기간만료">기간만료</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              지역
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="서울 전체">서울 전체</option>
              <option value="서울 강남구">서울 강남구</option>
              <option value="서울 강동구">서울 강동구</option>
              <option value="서울 강북구">서울 강북구</option>
              <option value="서울 강서구">서울 강서구</option>
              <option value="서울 관악구">서울 관악구</option>
              <option value="서울 광진구">서울 광진구</option>
              <option value="서울 구로구">서울 구로구</option>
              <option value="서울 금천구">서울 금천구</option>
              <option value="서울 노원구">서울 노원구</option>
              <option value="서울 도봉구">서울 도봉구</option>
              <option value="서울 동대문구">서울 동대문구</option>
              <option value="서울 동작구">서울 동작구</option>
              <option value="서울 마포구">서울 마포구</option>
              <option value="서울 서대문구">서울 서대문구</option>
              <option value="서울 서초구">서울 서초구</option>
              <option value="서울 성동구">서울 성동구</option>
              <option value="서울 성북구">서울 성북구</option>
              <option value="서울 송파구">서울 송파구</option>
              <option value="서울 양천구">서울 양천구</option>
              <option value="서울 영등포구">서울 영등포구</option>
              <option value="서울 용산구">서울 용산구</option>
              <option value="서울 은평구">서울 은평구</option>
              <option value="서울 종로구">서울 종로구</option>
              <option value="서울 중구">서울 중구</option>
              <option value="서울 중랑구">서울 중랑구</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              검색
            </label>
            <input
              type="text"
              placeholder="공고명으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 공고 그리드 */}
        <div className="grid grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.jobId}
              onClick={() => handleJobClick(job.jobId)}
              className="p-6 transition bg-white border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer"
            >
              {/* 제목과 상태 */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(
                    job.status
                  )}`}
                >
                  {getStatusText(job.status)}
                </span>
              </div>

              {/* 등록일 */}
              <div className="mb-4 text-sm text-gray-500">
                등록일: {job.createdAt}
              </div>

              {/* 상세 정보 */}
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">●</span>
                  <span className="text-gray-700">{job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📋</span>
                  <span className="text-gray-700">
                    {formatExperience(job.experienceMin, job.experienceMax)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">💰</span>
                  <span className="text-gray-700">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                </div>
              </div>

              {/* 지원자 통계 */}
              <div className="pt-4 mb-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {job.applicantCount}
                    </div>
                    <div className="text-sm text-gray-500">지원자</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {calculateAverageScore(job.applicantCount)}
                    </div>
                    <div className="text-sm text-gray-500">평균 점수</div>
                  </div>
                </div>
              </div>

              {/* 추가 통계 */}
              <div className="flex justify-around py-2 mb-4 text-xs text-gray-600 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="font-semibold">조회수</div>
                  <div>{job.viewCount}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">북마크</div>
                  <div>{/* bookmarkCount는 JobPostingListResponse에 없음 */}0</div>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(job.jobId);
                  }}
                  className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  수정
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose(job.jobId);
                  }}
                  disabled={job.status === "CLOSED" || job.status === "EXPIRED"}
                  className={`px-4 py-2 text-white transition rounded-lg ${
                    job.status === "CLOSED" || job.status === "EXPIRED"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {job.status === "CLOSED" || job.status === "EXPIRED"
                    ? "마감됨"
                    : "마감"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredJobs.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <div className="mb-4 text-4xl">📭</div>
            <div className="text-lg font-medium">검색 결과가 없습니다</div>
            <div className="text-sm">다른 조건으로 검색해보세요</div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
