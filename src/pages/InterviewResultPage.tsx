import MockInterviewResultPage from "../features/interview/components/MockInterviewResultPage";
// ✅ 1. 훅 불러오기
import { usePageNavigation } from "../hooks/usePageNavigation";

interface InterviewResultPageProps {
  onNavigateToInterview?: () => void;
}

export default function InterviewResultPage({
  onNavigateToInterview,
}: InterviewResultPageProps) {
  // ✅ 2. 훅을 사용해서 필요한 값(activeMenu, handleMenuClick)을 만듭니다.
  // "interview" 카테고리의 "interview-sub-3"(면접 결과) 메뉴로 설정
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "interview",
    "interview-sub-3"
  );

  return (
    <MockInterviewResultPage
      onNavigateToInterview={onNavigateToInterview}
      // ✅ 3. 에러 나던 부분에 훅에서 만든 값을 넣어줍니다.
      activeMenu={activeMenu}
      onMenuClick={handleMenuClick}
    />
  );
}
