import { useState } from "react";
import Footer from "../components/Footer";

interface Job {
  id: number;
  title: string;
  status: "진행중" | "마감";
  registeredDate: string;
  location: string;
  experience: string;
  salary: string;
  applicants: number;
  averageScore: number;
}

interface JobManagementPageProps {
  onNewJobClick?: () => void;
  onLogoClick?: () => void;
}

export default function JobManagementPage({ onNewJobClick, onLogoClick }: JobManagementPageProps) {
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const jobs: Job[] = [
    {
      id: 1,
      title: "프론트엔드 개발자",
      status: "진행중",
      registeredDate: "2024.12.01",
      location: "성남",
      experience: "5년이",
      salary: "6,000 ~ 6,000만원",
      applicants: 42,
      averageScore: 89.2
    },
    {
      id: 2,
      title: "백엔드 개발자",
      status: "진행중",
      registeredDate: "2024.11.28",
      location: "성남",
      experience: "3년 이상",
      salary: "5,000 ~ 7,000만원",
      applicants: 38,
      averageScore: 85.7
    },
    {
      id: 3,
      title: "풀스택 개발자",
      status: "진행중",
      registeredDate: "2024.11.20",
      location: "한국",
      experience: "3년 이상",
      salary: "4,500 ~ 6,500만원",
      applicants: 29,
      averageScore: 91.3
    },
    {
      id: 4,
      title: "DevOps 엔지니어",
      status: "마감",
      registeredDate: "2024.11.15",
      location: "성남",
      experience: "5년이",
      salary: "6,500 ~ 8,500만원",
      applicants: 67,
      averageScore: 82.4
    }
  ];

  const handleNewJob = () => {
    if (onNewJobClick) {
      onNewJobClick();
    } else {
      console.log("새 공고 등록 클릭");
    }
  };

  const handleEdit = (jobId: number) => {
    console.log(`공고 ${jobId} 수정`);
  };

  const handleClose = (jobId: number) => {
    console.log(`공고 ${jobId} 마감`);
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      console.log("메인 페이지로 이동");
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
            <label className="block mb-2 text-sm font-medium text-gray-700">상태</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="진행중">진행중</option>
              <option value="마감">마감</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">지역</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="성남">성남</option>
              <option value="서울">서울</option>
              <option value="한국">한국</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">검색</label>
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
          {jobs.map((job) => (
            <div key={job.id} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition">
              {/* 제목과 상태 */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    job.status === "진행중"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              {/* 등록일 */}
              <div className="mb-4 text-sm text-gray-500">
                등록일: {job.registeredDate}
              </div>

              {/* 상세 정보 */}
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">●</span>
                  <span className="text-gray-700">{job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📋</span>
                  <span className="text-gray-700">{job.experience}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">💰</span>
                  <span className="text-gray-700">{job.salary}</span>
                </div>
              </div>

              {/* 지원자 통계 */}
              <div className="pt-4 mb-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{job.applicants}</div>
                    <div className="text-sm text-gray-500">지원자</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{job.averageScore}</div>
                    <div className="text-sm text-gray-500">평균 점수</div>
                  </div>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleEdit(job.id)}
                  className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  수정
                </button>
                <button
                  onClick={() => handleClose(job.id)}
                  className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                >
                  마감
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
