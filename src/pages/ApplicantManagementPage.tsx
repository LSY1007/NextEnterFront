import { useState } from "react";
import Footer from "../components/Footer";

interface Applicant {
  id: number;
  name: string;
  age: number;
  skills: string[];
  experience: string;
  score: number;
  appliedDate: string;
}

interface ApplicantManagementPageProps {
  onLogoClick?: () => void;
  onApplicantClick?: (applicantId: number) => void;
}

export default function ApplicantManagementPage({ onLogoClick, onApplicantClick }: ApplicantManagementPageProps) {
  const [selectedJob, setSelectedJob] = useState("프론트엔드 개발자");
  const [experienceRange, setExperienceRange] = useState("전체");
  const [scoreFilter, setScoreFilter] = useState("최신 작성순");

  const applicants: Applicant[] = [
    {
      id: 1,
      name: "김민준",
      age: 28,
      skills: ["React", "TypeScript", "Node.js"],
      experience: "5년",
      score: 92,
      appliedDate: "2024.12.19"
    },
    {
      id: 2,
      name: "이서윤",
      age: 26,
      skills: ["Vue.js", "JavaScript", "CSS"],
      experience: "3년",
      score: 88,
      appliedDate: "2024.12.14"
    },
    {
      id: 3,
      name: "박지후",
      age: 32,
      skills: ["React", "Next.js", "GraphQL"],
      experience: "7년",
      score: 95,
      appliedDate: "2024.12.13"
    },
    {
      id: 4,
      name: "최수아",
      age: 24,
      skills: ["React", "TypeScript", "Tailwind"],
      experience: "2년",
      score: 85,
      appliedDate: "2024.12.12"
    },
    {
      id: 5,
      name: "정현우",
      age: 29,
      skills: ["Angular", "TypeScript", "RxJS"],
      experience: "4년",
      score: 90,
      appliedDate: "2024.12.11"
    },
    {
      id: 6,
      name: "김예은",
      age: 27,
      skills: ["React", "Redux", "Jest"],
      experience: "4년",
      score: 87,
      appliedDate: "2024.12.10"
    }
  ];

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
      "bg-teal-500"
    ];
    return colors[id % colors.length];
  };

  const handleApplicantClick = (applicantId: number) => {
    if (onApplicantClick) {
      onApplicantClick(applicantId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div 
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
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

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 타이틀 */}
          <h1 className="text-2xl font-bold mb-8">지원자 관리</h1>

          {/* 필터 섹션 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">공고 선택</label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="프론트엔드 개발자">프론트엔드 개발자</option>
                <option value="백엔드 개발자">백엔드 개발자</option>
                <option value="풀스택 개발자">풀스택 개발자</option>
                <option value="DevOps 엔지니어">DevOps 엔지니어</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">경력 범위</label>
              <select
                value={experienceRange}
                onChange={(e) => setExperienceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="전체">전체</option>
                <option value="1-3년">1-3년</option>
                <option value="3-5년">3-5년</option>
                <option value="5년+">5년 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">평점</label>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="최신 작성순">최신 작성순</option>
                <option value="높은 점수순">높은 점수순</option>
                <option value="낮은 점수순">낮은 점수순</option>
              </select>
            </div>
          </div>

          {/* 지원자 테이블 */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">지원자</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">나이</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">주요 스킬</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">경력</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">지원일</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applicants.map((applicant) => (
                  <tr 
                    key={applicant.id} 
                    onClick={() => handleApplicantClick(applicant.id)}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${getAvatarColor(applicant.id)} flex items-center justify-center text-white font-bold`}>
                          {getInitials(applicant.name)}
                        </div>
                        <span className="font-medium text-gray-900">{applicant.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 font-semibold">{applicant.age}세</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {applicant.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                        {applicant.experience}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{applicant.appliedDate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
