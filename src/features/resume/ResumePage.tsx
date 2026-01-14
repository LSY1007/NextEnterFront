import { useState, useRef, useEffect } from "react";
import Footer from "../../components/Footer";
import ResumeSidebar from "./components/ResumeSidebar";
import ResumeFormPage from "./ResumeFormPage";
// ✅ [필수] 메뉴 구조 데이터를 불러옵니다 (누구 자식인지 확인용)
import { navigationMenuData } from "../../features/navigation-menu/data/menuData";

interface ResumePageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function ResumePage({
  initialMenu,
  onNavigate,
}: ResumePageProps) {
  // 1. 초기값 설정
  const [activeMenu, setActiveMenu] = useState(initialMenu || "resume-sub-1");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [resumes, setResumes] = useState([
    { id: 1, title: '김유연_2025 개발자 이력서', industry: '프론트엔드 개발', applications: 3 },
    { id: 2, title: '김유연_프론트엔드 포지션', industry: '웹 개발', applications: 5 },
    { id: 3, title: '김유연_풀스택 개발자', industry: '풀스택', applications: 2 },
    { id: 4, title: '김유연_신입 개발자 이력서', industry: '신입 개발', applications: 1 },
  ]);
  useEffect(() => {
    if (initialMenu) {
      setActiveMenu(initialMenu);
    }
  }, [initialMenu]);
  const handleFileUpload = () => {
    console.log("파일 선택 클릭됨");
    fileInputRef.current?.click();
  };
const handleEdit = (id: number) => {
    console.log(`이력서 ${id} 수정 클릭됨`);
    setSelectedResumeId(id);
    setIsCreating(true);
  };

    // 2. 클릭한 메뉴(menuId)가 어느 대분류(탭)에 속하는지 찾기
    let targetTab = "";
  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };
   const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      setResumes(resumes.filter(r => r.id !== deleteTargetId));
      console.log(`이력서 ${deleteTargetId} 삭제됨`);
    }
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const handleCreateResume = () => {
    setSelectedResumeId(null); // 새 이력서 작성
    setIsCreating(true);
  };

    for (const section of sections) {
      // 대분류 ID랑 같거나, 하위 아이템들 중에 이 ID가 있으면 당첨
      if (
        section.id === menuId ||
        section.items?.some((item: any) => item.id === menuId)
      ) {
        targetTab = section.id;
        break;
      }
    }

    // 3. 찾은 탭이 현재 페이지('resume')가 아니라면 -> App.tsx에게 이동 요청
    if (onNavigate && targetTab) {
      onNavigate(targetTab, menuId);
    }
  const handleBackToList = () => {
    setIsCreating(false);
    setSelectedResumeId(null);
  };
  // ✅ [수정된 핵심 로직] 클릭된 메뉴의 '부모 탭'을 찾아서 이동시킵니다.
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId); // 1. 일단 클릭한 거 파란색으로 표시
 

    // ⚠️ [해결] 'as any[]'를 붙여서 TypeScript가 데이터 구조를 너무 엄격하게 검사하지 않도록 합니다.
    const sections = Object.values(navigationMenuData) as any[];
 
    for (const section of sections) {
      // 대분류 ID랑 같거나, 하위 아이템들 중에 이 ID가 있으면 당첨
      if (
        section.id === menuId ||
        section.items?.some((item: any) => item.id === menuId)
      ) {
        targetTab = section.id;
        break;
      }
    }

    // 3. 찾은 탭이 현재 페이지('resume')가 아니라면 -> App.tsx에게 이동 요청
    if (onNavigate && targetTab) {
      onNavigate(targetTab, menuId);
    }
  };

  // 이력서 작성 페이지 표시
  if (isCreating) {
    return <ResumeFormPage onBack={handleBackToList} resumeId={selectedResumeId} />;
  }

  return (
    <>
      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-4">이력서를 삭제하시겠습니까?</h3>
              <p className="text-gray-500 mt-2">삭제된 이력서는 복구할 수 없습니다.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex gap-6">
          {/* 사이드바 */}
          <ResumeSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick} // ✅ 수정된 핸들러 연결
          />

          {/* 메인 컨텐츠 */}
          <div className="flex-1 space-y-8">
            <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">이력서 관리</h2>
                <button
                  onClick={handleCreateResume}
                  className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  이력서 작성
                </button>
              </div>

              <div className="mb-6">
                <div className="mb-2 text-sm text-gray-600">총 {resumes.length}건</div>

                {/* 이력서 목록 - 스크롤 가능 */}
                <div className="max-h-96 overflow-y-auto space-y-3 p-2">
                  {resumes.map((resume) => (
                    <div key={resume.id} className="p-6 border-2 border-gray-300 rounded-lg bg-white hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{resume.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(resume.id)}
                            className="px-4 py-2 text-sm font-medium text-blue-600 transition border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(resume.id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white cursor-pointer"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">산업:</span>
                          <span className="ml-2 font-medium">{resume.industry}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">지원 내역:</span>
                          <span className="ml-2 text-blue-600 underline cursor-pointer">
                            {resume.applications}건 &gt;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-12 border-2 border-blue-300 border-dashed rounded-2xl bg-blue-50">
                <div className="text-center">
                  <div className="mb-4 text-6xl">📁</div>
                  <h3 className="mb-2 text-lg font-bold">
                    파일을 드래그 하거나 클릭하여 업로드
                  </h3>
                  <p className="mb-4 text-gray-600">
                    지원 형식: PDF, WORD, HWP, EXCEL
                    <br />
                    (최대 10MB)
                  </p>
                  <input type="file" ref={fileInputRef} className="hidden" />
                  <button
                    onClick={handleFileUpload}
                    className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                  >
                    파일선택
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
