import { useState } from "react";
import Footer from "../components/Footer";

interface TalentSearchPageProps {
  onLogoClick?: () => void;
}

interface Talent {
  id: number;
  name: string;
  position: string;
  experience: string;
  skills: string[];
  location: string;
  salary: string;
  matchScore: number;
  available: boolean;
}

export default function TalentSearchPage({ onLogoClick }: TalentSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("전체");
  const [selectedExperience, setSelectedExperience] = useState("전체");

  const talents: Talent[] = [
    {
      id: 1,
      name: "김**",
      position: "프론트엔드 개발자",
      experience: "5년",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      location: "서울",
      salary: "5,000~7,000만원",
      matchScore: 92,
      available: true
    },
    {
      id: 2,
      name: "이**",
      position: "백엔드 개발자",
      experience: "7년",
      skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
      location: "경기",
      salary: "6,000~8,000만원",
      matchScore: 88,
      available: true
    },
    {
      id: 3,
      name: "박**",
      position: "풀스택 개발자",
      experience: "4년",
      skills: ["React", "Node.js", "MongoDB", "Docker"],
      location: "서울",
      salary: "4,500~6,500만원",
      matchScore: 85,
      available: false
    },
    {
      id: 4,
      name: "최**",
      position: "DevOps 엔지니어",
      experience: "6년",
      skills: ["Kubernetes", "AWS", "Terraform", "Jenkins"],
      location: "서울",
      salary: "6,500~8,500만원",
      matchScore: 90,
      available: true
    }
  ];

  const handleContact = (talentId: number) => {
    console.log(`인재 ${talentId} 연락하기`);
  };

  const handleSave = (talentId: number) => {
    console.log(`인재 ${talentId} 저장하기`);
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      console.log("메인 페이지로 이동");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-blue-600">Next </span>
              <span className="text-2xl font-bold text-blue-800">Enter</span>
            </div>

            {/* 네비게이션 */}
            <nav className="flex space-x-8">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">■ 채용공고</button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">자료</button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">홍보</button>
            </nav>

            {/* 오른쪽 버튼 */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">로그인</button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">회원가입</button>
              <button
                onClick={handleLogoClick}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-4 py-8 mx-auto max-w-7xl">
        {/* 타이틀 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">인재 검색</h1>
          <p className="mt-2 text-gray-600">최적의 인재를 찾아보세요</p>
        </div>

        {/* 필터 섹션 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">포지션</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="프론트엔드">프론트엔드</option>
              <option value="백엔드">백엔드</option>
              <option value="풀스택">풀스택</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">경력</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="신입">신입</option>
              <option value="3년 이하">3년 이하</option>
              <option value="3-5년">3-5년</option>
              <option value="5년 이상">5년 이상</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">검색</label>
            <input
              type="text"
              placeholder="기술 스택으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 인재 목록 */}
        <div className="space-y-4">
          {talents.map((talent) => (
            <div key={talent.id} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                {/* 왼쪽: 인재 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{talent.name}</h3>
                    <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded">
                      {talent.position}
                    </span>
                    {talent.available && (
                      <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded">
                        연락 가능
                      </span>
                    )}
                  </div>

                  {/* 상세 정보 */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">경력:</span>
                      <span className="ml-2 font-medium">{talent.experience}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">지역:</span>
                      <span className="ml-2 font-medium">{talent.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">희망연봉:</span>
                      <span className="ml-2 font-medium">{talent.salary}</span>
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  <div className="flex flex-wrap gap-2">
                    {talent.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 오른쪽: 매칭 점수 및 버튼 */}
                <div className="flex flex-col items-center gap-4 ml-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{talent.matchScore}</div>
                    <div className="text-sm text-gray-500">매칭 점수</div>
                  </div>

                  <div className="flex flex-col gap-2 w-32">
                    <button
                      onClick={() => handleContact(talent.id)}
                      className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      연락하기
                    </button>
                    <button
                      onClick={() => handleSave(talent.id)}
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
      </div>

      <Footer />
    </div>
  );
}
