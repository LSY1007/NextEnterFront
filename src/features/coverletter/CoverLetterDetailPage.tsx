// src/features/coverletter/CoverLetterDetailPage.tsx
// 자소서 상세보기 페이지

import ResumeSidebar from "../resume/components/ResumeSidebar";

// 자소서 데이터 타입
interface CoverLetterItem {
  id: number;
  title: string;
  content: string;
  date: string;
  fileCount: number;
  status: string;
  files: string[];
}

interface CoverLetterDetailPageProps {
  coverLetter: CoverLetterItem; // 선택된 자소서 데이터
  onBack: () => void; // 목록으로 돌아가기
  onEdit: () => void; // 수정 모드로 전환
  onDelete: () => void; // 삭제 처리
  onMenuClick: (menuId: string) => void; // 사이드바 메뉴 클릭
  activeMenu: string; // 현재 활성 메뉴 (부모에서 전달)
}

export default function CoverLetterDetailPage({
  coverLetter,
  onBack,
  onEdit,
  onDelete,
  onMenuClick,
  activeMenu,
}: CoverLetterDetailPageProps) {
  // 사이드바 클릭 시 확인 후 이동
  const handleSidebarClick = (menuId: string) => {
    if (window.confirm("페이지를 이동하시겠습니까?")) {
      onMenuClick(menuId);
    }
  };

  // 삭제 확인
  const handleDelete = () => {
    if (window.confirm("정말 이 자소서를 삭제하시겠습니까?")) {
      onDelete();
    }
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h2 className="inline-block mb-6 text-2xl font-bold">자소서 상세</h2>
      <div className="flex gap-6">
        {/* 사이드바 */}
        <ResumeSidebar
          activeMenu={activeMenu}
          onMenuClick={handleSidebarClick}
        />

        {/* 메인 컨텐츠 */}
        <div className="flex-1 space-y-8">
          <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <span className="text-xl">←</span>
                <span>목록으로</span>
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onEdit}
                  className="px-5 py-2 text-blue-600 transition border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 text-red-600 transition border border-red-600 rounded-lg hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            </div>

            {/* 제목 영역 */}
            <div className="pb-6 mb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {coverLetter.title}
                </h3>
                <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                  {coverLetter.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <span>최종수정: {coverLetter.date}</span>
                <span className="mx-2">|</span>
                <span>첨부파일: {coverLetter.fileCount}개</span>
              </div>
            </div>

            {/* 내용 영역 */}
            <div className="mb-6">
              <h4 className="mb-3 text-lg font-semibold text-gray-800">내용</h4>
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {coverLetter.content || "작성된 내용이 없습니다."}
                </p>
              </div>
            </div>

            {/* 첨부파일 영역 */}
            {coverLetter.files && coverLetter.files.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  첨부파일
                </h4>
                <div className="space-y-2">
                  {coverLetter.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-500">📎</span>
                      <span className="text-gray-700">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
