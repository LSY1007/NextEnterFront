import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { getJobPostings, JobPostingListResponse } from "../../api/job";

type JobCategory = {
  id: number;
  icon: string;
  label: string;
  color: string;
};

interface HomePageProps {
  onLoginClick?: () => void;
}

// ✅ 광고 배너 컴포넌트 배열 (이미지 대신 코드로 렌더링 → 크기 문제 없음)
const AdBanner1 = () => (
  <div className="absolute inset-0 flex items-center overflow-hidden"
    style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)" }}>
    {/* 배경 장식 원들 */}
    <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
      style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
    <div className="absolute right-32 -bottom-6 w-28 h-28 rounded-full opacity-10"
      style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />
    {/* 왼쪽 아이콘 영역 */}
    <div className="flex items-center justify-center w-16 h-16 ml-6 rounded-2xl flex-shrink-0"
      style={{ background: "rgba(167,139,250,0.2)", border: "1.5px solid rgba(167,139,250,0.4)" }}>
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12h4M12 16h4M8 12h.01M8 16h.01" stroke="#c4b5fd" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
    {/* 텍스트 영역 */}
    <div className="ml-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(167,139,250,0.25)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.4)" }}>
          AI POWERED
        </span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>NextEnter 프리미엄</span>
      </div>
      <p className="text-white font-bold text-base leading-tight">
        AI가 내 경력을 분석해 이력서를 <span style={{ color: "#a78bfa" }}>자동 완성</span>해 드립니다
      </p>
      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>합격률 3배 높은 맞춤형 이력서 · 30초 완성</p>
    </div>
    {/* 오른쪽 CTA */}
    <div className="flex-shrink-0 mr-6 ml-4">
      <button className="px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all hover:scale-105"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "white", boxShadow: "0 4px 15px rgba(124,58,237,0.5)" }}>
        무료 시작 →
      </button>
    </div>
  </div>
);

const AdBanner2 = () => (
  <div className="absolute inset-0 flex items-center overflow-hidden"
    style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1b2a3b 35%, #1a3a5c 65%, #0d2137 100%)" }}>
    {/* 배경 패턴 */}
    <div className="absolute inset-0 opacity-5"
      style={{ backgroundImage: "repeating-linear-gradient(45deg, #60a5fa 0, #60a5fa 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-15"
      style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
    {/* 왼쪽 뱃지 */}
    <div className="flex-shrink-0 ml-6">
      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl"
        style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}>
        <span className="text-white font-black text-xl leading-none">취업</span>
        <span className="text-white font-black text-[10px] leading-none mt-0.5">SUCCESS</span>
      </div>
    </div>
    {/* 텍스트 */}
    <div className="ml-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.4)" }}>
          🔥 한정 특가
        </span>
      </div>
      <p className="text-white font-bold text-base leading-tight">
        취업 성공 패키지 <span style={{ color: "#fbbf24" }}>첫 달 무료</span> · 면접부터 연봉협상까지
      </p>
      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>전담 커리어 코치 1:1 매칭 · 합격 시 환급 보장</p>
    </div>
    {/* 오른쪽 CTA */}
    <div className="flex-shrink-0 mr-6 ml-4 text-center">
      <button className="px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all hover:scale-105"
        style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "white", boxShadow: "0 4px 15px rgba(245,158,11,0.5)" }}>
        무료 상담 신청
      </button>
      <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>오늘만 선착순 50명</p>
    </div>
  </div>
);

const AdBanner3 = () => (
  <div className="absolute inset-0 flex items-center overflow-hidden"
    style={{ background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" }}>
    {/* 우측 장식 */}
    <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10"
      style={{ background: "linear-gradient(90deg, transparent, #34d399)" }} />
    <div className="absolute right-16 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-15"
      style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />
    {/* 왼쪽 아이콘 */}
    <div className="flex items-center justify-center w-16 h-16 ml-6 rounded-2xl flex-shrink-0"
      style={{ background: "rgba(16,185,129,0.15)", border: "1.5px solid rgba(16,185,129,0.35)" }}>
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-3.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V21m-4 0h4" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 7h1m5 0h1M9 11h1m5 0h1M9 15h1m5 0h1" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
    {/* 텍스트 */}
    <div className="ml-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.4)" }}>
          기업 채용담당자 전용
        </span>
      </div>
      <p className="text-white font-bold text-base leading-tight">
        <span style={{ color: "#34d399" }}>검증된 개발자 인재풀</span> 3만 명+ · 지금 바로 채용 공고 등록
      </p>
      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>평균 14일 이내 채용 완료 · 첫 공고 게시 무료</p>
    </div>
    {/* 오른쪽 CTA */}
    <div className="flex-shrink-0 mr-6 ml-4">
      <button className="px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all hover:scale-105"
        style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", boxShadow: "0 4px 15px rgba(16,185,129,0.5)" }}>
        채용 공고 등록 →
      </button>
    </div>
  </div>
);

// ✅ 광고 배너 컴포넌트 배열
const adBannerComponents = [AdBanner1, AdBanner2, AdBanner3];

// ✅ 카드 상단 그라데이션 색상 배열
const cardBorderColors = [
  "from-purple-400 to-purple-600",
  "from-blue-400 to-blue-600",
  "from-green-400 to-green-600",
  "from-lime-400 to-lime-600",
];

export default function HomePage({ onLoginClick }: HomePageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [recommendedJobs, setRecommendedJobs] = useState<JobPostingListResponse[]>([]);
  const [moreJobs, setMoreJobs] = useState<JobPostingListResponse[]>([]);
  const [allJobs, setAllJobs] = useState<JobPostingListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<'recommended' | 'hot' | 'public'>('recommended');
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adBannerComponents.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const recommendedResponse = await getJobPostings({ page: 0, size: 12 });
        setRecommendedJobs(recommendedResponse.content);
        const moreResponse = await getJobPostings({ page: 0, size: 3 });
        setMoreJobs(moreResponse.content);
        const allResponse = await getJobPostings({ page: 0, size: 100 });
        setAllJobs(allResponse.content);
      } catch (error) {
        console.error("공고 데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobClick = (jobId: number) => {
    navigate(`/user/jobs/${jobId}`);
  };

  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    const backendUrl = "https://api.nextenter.store";
    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
  };

  const jobCategories: JobCategory[] = [
    { id: 1, icon: "/images/react.png", label: "프론트", color: "bg-purple-100" },
    { id: 2, icon: "/images/spring boot.png", label: "백엔드", color: "bg-blue-100" },
    { id: 4, icon: "/images/풀스텍.png", label: "풀스택", color: "bg-red-100" },
    { id: 6, icon: "/images/notion.png", label: "PM", color: "bg-gray-100" },
    { id: 8, icon: "/images/AI.png", label: "AI 엔지니어", color: "bg-cyan-100" },
    { id: 5, icon: "/images/Figma.png", label: "디자이너", color: "bg-orange-100" },
  ];

  const calculateDday = (deadline: string): string => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "마감";
    if (diffDays === 0) return "D-day";
    return `D-${diffDays}`;
  };

  const getCompanyInitial = (companyName: string): string => {
    return companyName?.charAt(0) || "C";
  };

  const getCardBorderColor = (index: number): string => {
    return cardBorderColors[index % cardBorderColors.length];
  };

  return (
    <main className="px-3 md:px-6 py-4 md:py-8 mx-auto max-w-[1600px] bg-white">
      {/* 상단 영역 */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 mb-6">
        {/* 왼쪽: 오늘의 합격 꿀팁 */}
        <aside className="hidden md:flex md:flex-col md:w-72 gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl shadow-md">
            <div className="flex items-start mb-4">
              <div className="flex items-center justify-center w-14 h-14 mr-3 bg-gradient-to-br from-purple-400 via-blue-400 to-teal-400 rounded-2xl flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight pt-1">오늘의 합격 꿀팁</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 mb-4">
              경쟁자는 합격하고<br />나는 탈락하는 이유, 알려드려요.
            </p>
            <button className="text-sm font-semibold text-blue-600 hover:underline">확인하기</button>
          </div>
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">인적성검사</h3>
            </div>
            <p className="text-sm text-gray-600">서류합격률 UP</p>
          </div>
        </aside>

        {/* 중앙: 추천 공고 캐러셀 */}
        <div className="flex-1 max-w-4xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">공고를 불러오는 중...</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {recommendedJobs.length > 0 ? (
                <>
                  {carouselIndex > 0 && (
                    <button
                      onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all -translate-x-6"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <div className="overflow-hidden bg-white rounded-2xl md:rounded-3xl p-4 md:p-11 border-2 border-gray-200">
                    <div className="flex items-center mb-4">
                      <span className="mr-2 text-xl">👤</span>
                      <h3 className="text-sm font-bold">회원님을 위한 추천공고</h3>
                    </div>
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${carouselIndex * (100 / 3)}%)` }}
                    >
                      {recommendedJobs.map((job) => (
                        <div key={job.jobId} className="flex-shrink-0 px-2" style={{ width: 'calc(100% / 3)' }}>
                          <div
                            onClick={() => handleJobClick(job.jobId)}
                            className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg h-full flex flex-col border-2 border-gray-200 px-4 py-4"
                          >
                            <div className="flex items-center justify-start mb-3">
                              {job.logoUrl ? (
                                <img src={job.logoUrl} alt={job.companyName} className="h-8 w-auto object-contain" />
                              ) : (
                                <div className="px-3 py-1 text-sm font-bold text-gray-400">{job.companyName}</div>
                              )}
                            </div>
                            <h4 className="mb-3 text-base md:text-lg font-bold text-gray-900 line-clamp-2 flex-grow">{job.title}</h4>
                            <p className="mb-3 text-sm text-gray-600">{job.companyName}</p>
                            <div className="mt-auto">
                              <p className="text-sm text-gray-400 text-right">
                                ~{new Date(job.deadline).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}({['일','월','화','수','목','금','토'][new Date(job.deadline).getDay()]})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {carouselIndex < recommendedJobs.length - 3 && (
                    <button
                      onClick={() => setCarouselIndex(prev => prev + 1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all translate-x-6"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <p className="text-4xl mb-4">📭</p>
                  <p>등록된 공고가 없습니다</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽: 광고 배너 */}
        <aside className="hidden md:block w-72 space-y-4">
          <div className="relative h-44 p-4 overflow-hidden text-white shadow-lg bg-gradient-to-br from-teal-700 to-teal-900 rounded-xl">
            <h3 className="mb-2 text-lg font-bold">구직자 대상</h3>
            <h3 className="mb-4 text-lg font-bold">해외 취업 사기에 주의하세요!</h3>
            <button className="px-4 py-2 text-sm text-white transition bg-white rounded-lg bg-opacity-20 hover:bg-opacity-30">
              바로가기 →
            </button>
            <div className="absolute text-xs bottom-2 right-3">5/5</div>
          </div>
          <div className="relative h-28 p-4 bg-white border border-gray-200 shadow-lg rounded-xl">
            <h3 className="mb-2 text-base font-bold">SK 하이닉스 채용 공고</h3>
            <p className="mb-3 text-xs text-gray-600">연봉 5500만원~7500만원</p>
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center justify-center w-14 h-14 font-bold text-white bg-purple-600 rounded-full">SK</div>
            </div>
            <div className="absolute text-xs text-gray-500 bottom-2 right-3">1/6</div>
          </div>
        </aside>
      </div>

      {/* ✅ 하단 광고 배너 - 코드 기반 렌더링으로 이미지 크기 문제 완전 해결 */}
      {!isLoading && (
        <div className="relative h-24 rounded-xl shadow-lg overflow-hidden mb-8">
          {adBannerComponents.map((BannerComponent, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentAdIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <BannerComponent />
            </div>
          ))}
          <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-3 left-1/2 z-10">
            {adBannerComponents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentAdIndex ? "bg-white w-6" : "bg-white/50 w-2 hover:bg-white/75"
                }`}
                aria-label={`광고 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ✅ 모든 공고 카드 섹션 */}
      {!isLoading && allJobs.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">회원님이 꼭 봐야 할 공고 (플래티넘)</h2>
            <p className="text-sm text-gray-600">총 {allJobs.length}개의 공고</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {allJobs.map((job, index) => (
              <div key={job.jobId} className="relative" style={{ height: '360px' }}>
                <div
                  onClick={() => handleJobClick(job.jobId)}
                  onMouseEnter={() => setHoveredCardId(job.jobId)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`
                    absolute top-0 left-0 right-0
                    rounded-2xl md:rounded-3xl cursor-pointer overflow-hidden
                    transition-all duration-500 ease-in-out
                    ${hoveredCardId === job.jobId
                      ? 'shadow-2xl h-[560px] md:h-[700px] z-50'
                      : 'shadow-sm h-[360px] z-10'
                    }
                  `}
                >
                  {hoveredCardId !== job.jobId && (
                    <div className="relative w-full h-full bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getCardBorderColor(index)}`}></div>
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="absolute top-4 right-4 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                      <div className="flex justify-center px-5 pt-4 pb-3">
                        <div className="flex items-center justify-center h-12 max-w-[120px]">
                          {job.logoUrl ? (
                            <img src={job.logoUrl} alt={job.companyName} className="max-h-12 w-auto object-contain" />
                          ) : (
                            <div className="px-3 py-1.5 text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded">
                              {job.companyName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="px-5 py-2 flex items-start justify-start">
                        <p className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed text-left">
                          {job.description || "상세 설명이 없습니다."}
                        </p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-[150px] rounded-b-3xl overflow-hidden">
                        {job.thumbnailUrl ? (
                          <img src={job.thumbnailUrl} alt={job.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <p className="text-sm">썸네일 이미지</p>
                              <p className="text-xs">(등록 필요)</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <div className="flex items-center justify-between text-white text-xs">
                            <span className="flex items-center gap-1">📍 {job.location}</span>
                            <span className="px-2 py-1 bg-blue-600 rounded font-semibold">{calculateDday(job.deadline)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {hoveredCardId === job.jobId && (
                    <div className="relative w-full h-full rounded-3xl overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getCardBorderColor(index)} z-20`}></div>
                      {job.detailImageUrl ? (
                        <img src={job.detailImageUrl} alt={`${job.title} 상세`} className="w-full h-auto" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <p className="text-xl font-bold mb-2">상세 이미지</p>
                            <p className="text-base">(등록 필요)</p>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-20 rounded-b-3xl">
                        <div className="text-white space-y-3">
                          <div>
                            <p className="text-sm font-semibold mb-1 opacity-90">{job.companyName}</p>
                            <h4 className="text-lg font-bold line-clamp-2">{job.title}</h4>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-white/30">
                            <span className="text-sm font-semibold flex items-center gap-2">💼 {job.jobCategory}</span>
                            <span className="px-4 py-2 bg-blue-600 rounded-full font-bold text-sm">{calculateDday(job.deadline)}</span>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <span className="flex items-center gap-1">👁️ {job.viewCount?.toLocaleString() || 0}</span>
                            <span className="flex items-center gap-1">📝 {job.applicantCount?.toLocaleString() || 0}</span>
                            <span className="flex items-center gap-1">⭐ {job.bookmarkCount?.toLocaleString() || 0}</span>
                          </div>
                          <div className="space-y-1 text-sm opacity-90">
                            <p className="flex items-center gap-1">📍 {job.location}</p>
                            {(job.experienceMin !== undefined || job.experienceMax !== undefined) && (
                              <p className="flex items-center gap-1">
                                💼 경력: {job.experienceMin ?? 0}년 ~ {job.experienceMax ?? '제한없음'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
