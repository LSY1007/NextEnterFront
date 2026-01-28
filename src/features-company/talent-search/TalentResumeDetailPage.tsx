import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPublicResumeDetail, ResumeResponse, ResumeSections } from "../../api/resume";
import { saveTalent, contactTalent } from "../../api/talent";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";

interface TalentResumeDetailPageProps {
  resumeId: number;
  onBack: () => void;
}

export default function TalentResumeDetailPage({
  resumeId,
  onBack,
}: TalentResumeDetailPageProps) {
  const { user } = useAuth();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation("talent", "talent-sub-1");

  const [resume, setResume] = useState<ResumeResponse | null>(null);
  const [sections, setSections] = useState<ResumeSections | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resumeId && user?.userId) {
      loadResumeDetail();
    }
  }, [resumeId, user?.userId]);

  const loadResumeDetail = async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await getPublicResumeDetail(resumeId, user.userId);
      setResume(data);

      if (data.structuredData) {
        try {
          const parsedSections: ResumeSections = JSON.parse(data.structuredData);
          setSections(parsedSections);
        } catch (parseError) {
          console.error("섹션 데이터 파싱 오류:", parseError);
        }
      }
    } catch (err: any) {
      console.error("이력서 상세 조회 오류:", err);
      setError(err.response?.data?.message || "이력서를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = async () => {
    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    const message = prompt("인재에게 보낼 메시지를 입력하세요:");
    if (!message) return;
    
    try {
      const response = await contactTalent(resumeId, message, user.userId);
      if (response.success) {
        alert("연락 요청이 전송되었습니다!");
      }
    } catch (error: any) {
      console.error("연락 요청 오류:", error);
      alert(error.response?.data?.message || "연락 요청에 실패했습니다.");
    }
  };

  const handleSave = async () => {
    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    try {
      const response = await saveTalent(resumeId, user.userId);
      if (response.success) {
        alert("인재가 스크랩되었습니다!");
      } else {
        alert("이미 스크랩된 인재입니다.");
      }
    } catch (error: any) {
      console.error("인재 스크랩 오류:", error);
      alert(error.response?.data?.message || "인재 스크랩에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className=" bg-gray-50">
        <div className="flex gap-10 px-6 py-8 mx-auto max-w-screen-2xl">
          <aside className="flex-shrink-0 w-64">
            <CompanyLeftSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
          </aside>
          <main className="flex items-center justify-center flex-1 min-w-0">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex gap-10 px-6 py-8 mx-auto max-w-screen-2xl">
          <aside className="flex-shrink-0 w-64">
            <CompanyLeftSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
          </aside>
          <main className="flex-1 min-w-0">
            <div className="p-8 text-center bg-white border border-red-200 rounded-xl">
              <div className="mb-4 text-4xl">❌</div>
              <p className="mb-4 text-lg text-red-600">{error}</p>
              <button
                onClick={onBack}
                className="px-6 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                목록으로 돌아가기
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!resume || !sections) {
    return null;
  }

  const { personalInfo, experiences, certificates, educations, careers, portfolios, coverLetter } = sections;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-10 px-6 py-8 mx-auto max-w-screen-2xl">
        {/* 왼쪽 사이드바 */}
        <aside className="flex-shrink-0 hidden w-64 lg:block">
          <CompanyLeftSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 min-w-0">
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            {/* 상단: 뒤로가기 버튼 */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <span>←</span>
                <span>목록으로 돌아가기</span>
              </button>
            </div>

            {/* 인재 프로필 헤더 */}
            <div className="flex items-start justify-between pb-6 mb-8 border-b">
              {/* 왼쪽: 프로필 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-purple-500 rounded-full">
                  {personalInfo?.name?.charAt(0) || "인"}
                </div>
                <div>
                  <h1 className="mb-1 text-2xl font-bold text-gray-900">
                    {personalInfo?.name || "이름 없음"}
                  </h1>
                  <p className="flex items-center space-x-1 text-sm text-gray-500">
                    <span>📧</span>
                    <span>{personalInfo?.email || "이메일 미등록"}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    🎂 {personalInfo?.birthDate || "생년월일 미등록"}
                  </p>
                </div>
              </div>

              {/* 오른쪽: AI 매칭 점수 */}
              <div className="text-right">
                <div className="text-5xl font-bold text-purple-600">
                  0
                </div>
                <div className="text-sm text-gray-500">AI 매칭 점수</div>
              </div>
            </div>

            {/* 지원 정보 */}
            <div className="p-6 mb-8 rounded-lg bg-gray-50">
              <h2 className="mb-4 text-lg font-bold text-gray-900">이력서 정보</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-1 text-sm text-gray-500">이력서 제목</div>
                  <div className="font-medium text-gray-900">
                    {resume.title || "제목 없음"}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">직무</div>
                  <div className="font-medium text-gray-900">
                    {resume.jobCategory || "미지정"}
                  </div>
                </div>
              </div>
            </div>

            {/* 인적사항 */}
            <div className="p-6 mb-8 border-2 border-indigo-200 rounded-lg bg-indigo-50">
              <h2 className="mb-4 text-lg font-bold text-gray-900">📋 인적사항</h2>
              <div className="grid grid-cols-2 gap-4">
                {personalInfo?.gender && (
                  <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                    <div className="mb-1 text-xs font-medium text-gray-500">성별</div>
                    <div className="font-semibold text-gray-900">{personalInfo.gender}</div>
                  </div>
                )}
                {personalInfo?.birthDate && (
                  <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                    <div className="mb-1 text-xs font-medium text-gray-500">생년월일</div>
                    <div className="font-semibold text-gray-900">{personalInfo.birthDate}</div>
                  </div>
                )}
                {personalInfo?.email && (
                  <div className="col-span-2 p-3 bg-white border border-indigo-200 rounded-lg">
                    <div className="mb-1 text-xs font-medium text-gray-500">이메일</div>
                    <div className="font-semibold text-gray-900">{personalInfo.email}</div>
                  </div>
                )}
                {personalInfo?.address && (
                  <div className="col-span-2 p-3 bg-white border border-indigo-200 rounded-lg">
                    <div className="mb-1 text-xs font-medium text-gray-500">주소</div>
                    <div className="font-semibold text-gray-900">{personalInfo.address}</div>
                  </div>
                )}
              </div>
            </div>

            {/* 주요 스킬 */}
            {resume.skills && (
              <div className="p-6 mb-8 border-2 border-purple-200 rounded-lg bg-purple-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">💻 주요 스킬</h2>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(resume.skills).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 text-sm font-semibold text-purple-700 bg-white border-2 border-purple-300 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 경험/활동/교육 */}
            {experiences && experiences.length > 0 && (
              <div className="p-6 mb-8 border-2 border-orange-200 rounded-lg bg-orange-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">🌟 경험/활동/교육</h2>
                <div className="space-y-3">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-white border border-orange-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{exp.title}</div>
                      <div className="text-sm text-gray-600">{exp.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 자격증/어학/수상 */}
            {certificates && certificates.length > 0 && (
              <div className="p-6 mb-8 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">🏆 자격증/어학/수상</h2>
                <div className="space-y-3">
                  {certificates.map((cert, idx) => (
                    <div key={idx} className="p-4 bg-white border border-yellow-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{cert.title}</div>
                      <div className="text-sm text-gray-600">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 학력 */}
            {educations && educations.length > 0 && (
              <div className="p-6 mb-8 border-2 border-blue-200 rounded-lg bg-blue-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">🎓 학력</h2>
                <div className="space-y-3">
                  {educations.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-white border border-blue-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{edu.school}</div>
                      <div className="text-sm text-gray-600">{edu.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 경력 */}
            {careers && careers.length > 0 && (
              <div className="p-6 mb-8 border-2 border-teal-200 rounded-lg bg-teal-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">💼 경력</h2>
                <div className="space-y-3">
                  {careers.map((career, idx) => (
                    <div key={idx} className="p-4 bg-white border border-teal-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{career.company}</div>
                      <div className="text-sm text-gray-600">{career.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 포트폴리오 */}
            {portfolios && portfolios.length > 0 && (
              <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">📁 포트폴리오</h2>
                <div className="space-y-3">
                  {portfolios.map((portfolio, idx) => (
                    <div key={idx} className="p-4 bg-white border border-green-200 rounded-lg">
                      <div className="font-medium text-gray-700">
                        📄 {portfolio.filename}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 자기소개서 */}
            {coverLetter && (coverLetter.title || coverLetter.content) && (
              <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">✍️ 자기소개서</h2>
                {coverLetter.title && (
                  <div className="p-4 mb-4 bg-white border border-green-200 rounded-lg">
                    <div className="font-semibold">{coverLetter.title}</div>
                  </div>
                )}
                {coverLetter.content && (
                  <div className="p-4 bg-white border border-green-200 rounded-lg">
                    <p className="leading-relaxed text-gray-900 whitespace-pre-wrap">
                      {coverLetter.content}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 하단 버튼 */}
            <div className="flex gap-4">
              <button
                onClick={handleContact}
                className="flex-1 px-6 py-3 font-semibold text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                면접 제안
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 font-semibold text-purple-700 transition bg-purple-100 rounded-lg hover:bg-purple-200"
              >
                스크랩
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}