import { useState } from "react";
// Footer 임포트 제거됨

interface CreditManagementPageProps {
  onLogoClick?: () => void;
}

export default function CreditManagementPage({
  onLogoClick,
}: CreditManagementPageProps) {
  const [currentCredit] = useState(4200);

  const recommendedApplicants = [
    { name: "김0연", age: "23세", field: "무경력", cost: 50 },
    { name: "송0서", age: "30세", field: "2년", cost: 110 },
    { name: "유0현", age: "28세", field: "1년", cost: 80 },
    { name: "서0민", age: "36세", field: "7년", cost: 400 },
  ];

  const appliedCandidates = [
    { name: "이0영", age: "32세", status: "신입의 마음가짐으로..." },
    { name: "고0영", age: "41세", status: "15년 이상의 경력..." },
  ];

  // 헤더가 삭제되어 사용되지 않지만, props 인터페이스 유지를 위해 남겨둡니다.
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleChargeClick = () => {
    console.log("충전하기 클릭");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ❌ 헤더 삭제됨 */}

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* 타이틀 & 충전 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 text-xl text-white rounded-full bg-gradient-to-br from-yellow-400 to-orange-400">
              🪙
            </div>
            <h1 className="text-2xl font-bold text-blue-600">보유 크레딧</h1>
          </div>
          <button
            onClick={handleChargeClick}
            className="flex items-center px-6 py-2 space-x-2 font-semibold text-blue-600 transition bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <span>+</span>
            <span>충전하기</span>
          </button>
        </div>

        {/* 크레딧 카드 */}
        <div className="p-8 mb-8 shadow-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="mb-2 text-lg font-medium">
                NEXT ENTER님의 현재 사용 가능 크레딧
              </div>
            </div>
            <div className="flex items-center px-8 py-4 space-x-3 bg-white rounded-full">
              <span className="text-4xl font-bold text-gray-900">
                {currentCredit.toLocaleString()}
              </span>
              <div className="flex items-center justify-center w-10 h-10 text-xl rounded-full bg-gradient-to-br from-yellow-400 to-orange-400">
                🪙
              </div>
            </div>
          </div>
        </div>

        {/* 그리드 레이아웃 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 왼쪽 상단: 추천 지원자에게 연락 보내기 */}
          <div className="p-6 bg-white border-2 border-blue-500 rounded-2xl">
            <div className="flex items-center mb-4 space-x-2">
              <span className="text-xl">⭐</span>
              <h2 className="text-lg font-bold text-gray-900">
                추천 지원자에게 연락 보내기
              </h2>
            </div>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  {recommendedApplicants.map((candidate, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {candidate.name}
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {candidate.age}
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {candidate.field}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-orange-500">🪙</span>
                          <span className="font-semibold text-gray-900">
                            {candidate.cost}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 오른쪽 상단: 내가 올린 공고 보기 */}
          <div className="relative p-6 bg-white border-2 border-blue-500 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📋</span>
                <h2 className="text-lg font-bold text-gray-900">
                  내가 올린 공고 보기
                </h2>
              </div>
              <button className="text-2xl text-purple-600 hover:text-purple-700">
                +
              </button>
            </div>
            <div className="p-8 text-center border-2 border-gray-300 border-dashed bg-gray-50 rounded-xl">
              <div className="mb-4">
                <h3 className="mb-2 font-bold text-gray-900">
                  NEXT ENTER 인재 공고
                </h3>
              </div>
              <div className="text-sm text-gray-500">내용</div>
            </div>
          </div>

          {/* 왼쪽 하단: 크레딧은 어디에 쓸 수 있나요? */}
          <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl">
            <div className="pl-4 mb-4 border-l-4 border-red-400">
              <h3 className="text-lg font-bold text-gray-900">
                크레딧은 어디에 쓸 수 있나요?
              </h3>
            </div>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li></li>
              <li></li>
              <li></li>
            </ol>
          </div>

          {/* 오른쪽 하단: 지원한 인재 */}
          <div className="p-6 bg-white border-2 border-blue-500 rounded-2xl">
            <div className="flex items-center mb-4 space-x-2">
              <span className="text-xl">👤</span>
              <h2 className="text-lg font-bold text-gray-900">지원한 인재</h2>
            </div>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  {appliedCandidates.map((candidate, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {candidate.name}
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {candidate.age}
                      </td>
                      <td className="max-w-xs px-4 py-4 text-gray-700 truncate">
                        {candidate.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* ❌ 푸터 삭제됨 */}
    </div>
  );
}
