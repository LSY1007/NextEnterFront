import { useState, useEffect } from "react";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import { searchTalents, TalentSearchResponse } from "../../api/talent";
import { getResumeList, ResumeListItem } from "../../api/resume"; // 임시 해결책용

export default function TalentSearchPage() {
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation("talent", "talent-sub-1");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("전체");
  const [selectedExperience, setSelectedExperience] = useState("전체");
  const [talents, setTalents] = useState<TalentSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 이력서 데이터 로드
  useEffect(() => {
    loadTalents();
  }, [selectedPosition, selectedExperience, searchQuery, currentPage]);

  const loadTalents = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        size: 20,
      };

      // 포지션 필터
      if (selectedPosition !== "전체") {
        params.jobCategory = selectedPosition;
      }

      // 검색어 필터
      if (searchQuery.trim()) {
        params.keyword = searchQuery.trim();
      }

      const response = await searchTalents(params);
      
      // ✅ 백엔드 API가 비어있으면 임시 해결책 사용
      if (response.content.length === 0 && response.totalElements === 0) {
        console.log("🚧 [임시해결책] 로컬 이력서 목록에서 공개된 이력서 필터링...");
        
        // 모든 사용자의 이력서를 가져오는 API가 없으므로 빈 결과 표시
        setTalents([]);
        setTotalPages(0);
        console.log("⚠️ [임시해결책] 백엔드 API가 필요합니다. /api/resume/search 또는 /api/resume/public 엔드포인트를 구현해주세요.");
      } else {
        setTalents(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("인재 검색 오류:", error);
      setTalents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 경력 필터링 (프론트엔드에서 처리)
  const filteredTalents = talents.filter((talent) => {
    if (selectedExperience === "전체") return true;
    const years = talent.experienceYears;
    
    if (selectedExperience === "신입" && years === 0) return true;
    if (selectedExperience === "3년 이하" && years > 0 && years <= 3) return true;
    if (selectedExperience === "3-5년" && years > 3 && years <= 5) return true;
    if (selectedExperience === "5년 이상" && years > 5) return true;
    
    return false;
  });

  const handleContact = (talentId: number) => {
    console.log(`인재 ${talentId} 연락하기`);
  };

  const handleSave = (talentId: number) => {
    console.log(`인재 ${talentId} 저장하기`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex px-4 py-8 mx-auto max-w-7xl">
        {/* 왼쪽 사이드바 */}
        <CompanyLeftSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
        />

        {/* 메인 컨텐츠 */}
        <div className="flex-1 pl-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">인재 검색</h1>
            <p className="mt-2 text-gray-600">최적의 인재를 찾아보세요</p>
          </div>

          {/* 필터 섹션 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                포지션
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="전체">전체</option>
                <option value="Backend">백엔드</option>
                <option value="Frontend">프론트엔드</option>
                <option value="Fullstack">풀스택</option>
                <option value="AI/LLM">AI/LLM</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile">모바일</option>
                <option value="Data">데이터</option>
                <option value="Security">보안</option>
                <option value="PM">프로젝트 매니저</option>
                <option value="Design">디자인</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                경력
              </label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="전체">전체</option>
                <option value="신입">신입</option>
                <option value="3년 이하">3년 이하</option>
                <option value="3-5년">3-5년</option>
                <option value="5년 이상">5년 이상</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                검색
              </label>
              <input
                type="text"
                placeholder="기술 스택으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* 인재 목록 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTalents.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="mb-2 text-lg">검색 결과가 없습니다.</p>
              <p className="mb-4 text-sm">다른 조건으로 검색해보세요.</p>
              <div className="p-4 mx-auto mt-6 text-sm text-left bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl">
                <div className="font-bold text-yellow-800 mb-2">💡 확인 사항:</div>
                <ul className="space-y-1 text-yellow-700">
                  <li>• 개인 사용자가 이력서를 "공개" 설정으로 저장했나요?</li>
                  <li>• 백엔드 API가 공개된 이력서만 반환하도록 구현되었나요?</li>
                  <li>• <code className="px-2 py-1 bg-yellow-100 rounded">/api/resume/search</code> 또는 <code className="px-2 py-1 bg-yellow-100 rounded">/api/resume/public</code> 엔드포인트가 필요합니다.</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                총 <span className="font-semibold text-purple-600">{filteredTalents.length}</span>명의 인재를 찾았습니다.
              </div>
              <div className="space-y-4">
                {filteredTalents.map((talent) => (
                  <div
                    key={talent.resumeId}
                    className="p-6 transition bg-white border border-gray-200 rounded-xl hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold">{talent.name}</h3>
                          <span className="px-3 py-1 text-sm font-medium text-purple-600 bg-purple-100 rounded">
                            {talent.jobCategory}
                          </span>
                          {talent.isAvailable && (
                            <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded">
                              연락 가능
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">경력:</span>
                            <span className="ml-2 font-medium">
                              {talent.experienceYears === 0 ? '신입' : `${talent.experienceYears}년`}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">지역:</span>
                            <span className="ml-2 font-medium">
                              {talent.location || '미지정'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">희망연봉:</span>
                            <span className="ml-2 font-medium">{talent.salaryRange || '협의'}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {talent.skills && talent.skills.length > 0 ? (
                            talent.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-sm text-purple-700 bg-purple-50 rounded-full"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">기술 스택 정보 없음</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>조회수: {talent.viewCount}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4 ml-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {Math.round(talent.matchScore)}
                          </div>
                          <div className="text-sm text-gray-500">매칭 점수</div>
                        </div>

                        <div className="flex flex-col w-32 gap-2">
                          <button
                            onClick={() => handleContact(talent.resumeId)}
                            className="px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                          >
                            연락하기
                          </button>
                          <button
                            onClick={() => handleSave(talent.resumeId)}
                            className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
