import { useState } from "react";
// Footer 임포트 제거됨

interface Applicant {
  id: number;
  name: string;
  age: number;
  jobPosting: string; // 지원한 공고
  jobCategory: string; // 직무
  skills: string[];
  experience: string;
  score: number;
  appliedDate: string;
}

interface ApplicantManagementPageProps {
  onLogoClick?: () => void;
  onApplicantClick?: (applicantId: number) => void;
}

export default function ApplicantManagementPage({
  onLogoClick,
  onApplicantClick,
}: ApplicantManagementPageProps) {
  const [selectedJobPosting, setSelectedJobPosting] = useState("전체");
  const [selectedJobCategory, setSelectedJobCategory] = useState("전체");
  const [experienceRange, setExperienceRange] = useState("전체");

  const applicants: Applicant[] = [
    {
      id: 1,
      name: "김민준",
      age: 28,
      jobPosting: "시니어 프론트엔드 개발자 채용",
      jobCategory: "프론트엔드 개발자",
      skills: ["React", "TypeScript", "Node.js"],
      experience: "5년",
      score: 92,
      appliedDate: "2024.12.19",
    },
    {
      id: 2,
      name: "이서윤",
      age: 26,
      jobPosting: "주니어 프론트엔드 개발자",
      jobCategory: "프론트엔드 개발자",
      skills: ["Vue.js", "JavaScript", "CSS"],
      experience: "3년",
      score: 88,
      appliedDate: "2024.12.14",
    },
    {
      id: 3,
      name: "박지후",
      age: 32,
      jobPosting: "백엔드 개발자 (Node.js)",
      jobCategory: "백엔드 개발자",
      skills: ["React", "Next.js", "GraphQL"],
      experience: "7년",
      score: 95,
      appliedDate: "2024.12.13",
    },
    {
      id: 4,
      name: "최수아",
      age: 24,
      jobPosting: "주니어 프론트엔드 개발자",
      jobCategory: "프론트엔드 개발자",
      skills: ["React", "TypeScript", "Tailwind"],
      experience: "2년",
      score: 85,
      appliedDate: "2024.12.12",
    },
    {
      id: 5,
      name: "정현우",
      age: 29,
      jobPosting: "풀스택 개발자 (React + Spring)",
      jobCategory: "풀스택 개발자",
      skills: ["Angular", "TypeScript", "RxJS"],
      experience: "4년",
      score: 90,
      appliedDate: "2024.12.11",
    },
    {
      id: 6,
      name: "김예은",
      age: 27,
      jobPosting: "시니어 프론트엔드 개발자 채용",
      jobCategory: "프론트엔드 개발자",
      skills: ["React", "Redux", "Jest"],
      experience: "4년",
      score: 87,
      appliedDate: "2024.12.10",
    },
  ];

  // 고유한 공고 목록 추출
  const uniqueJobPostings = [
    "전체",
    ...Array.from(new Set(applicants.map((a) => a.jobPosting))),
  ];

  // 헤더 삭제로 사용되지 않지만 인터페이스 유지를 위해 남겨둠
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
      "bg-teal-500",
    ];
    return colors[id % colors.length];
  };

  const handleApplicantClick = (applicantId: number) => {
    if (onApplicantClick) {
      onApplicantClick(applicantId);
    }
  };

  const handleJobPostingClick = (jobPosting: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJobPosting(jobPosting);
  };

  // 필터링 로직
  const filteredApplicants = applicants.filter((applicant) => {
    const jobPostingMatch =
      selectedJobPosting === "전체" ||
      applicant.jobPosting === selectedJobPosting;

    const jobCategoryMatch =
      selectedJobCategory === "전체" ||
      applicant.jobCategory === selectedJobCategory;

    const experienceMatch =
      experienceRange === "전체" ||
      (experienceRange === "1-3년" &&
        parseInt(applicant.experience) >= 1 &&
        parseInt(applicant.experience) <= 3) ||
      (experienceRange === "3-5년" &&
        parseInt(applicant.experience) >= 3 &&
        parseInt(applicant.experience) <= 5) ||
      (experienceRange === "5년+" && parseInt(applicant.experience) >= 5);

    return jobPostingMatch && jobCategoryMatch && experienceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 삭제 */}

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="p-8 bg-white shadow-lg rounded-2xl">
          {/* 타이틀 */}
          <h1 className="mb-8 text-2xl font-bold">지원자 관리</h1>

          {/* 필터 섹션 - 순서: 공고선택 - 직무선택 - 경력범위 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 공고 선택 */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                공고 선택
              </label>
              <select
                value={selectedJobPosting}
                onChange={(e) => setSelectedJobPosting(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {uniqueJobPostings.map((posting, idx) => (
                  <option key={idx} value={posting}>
                    {posting}
                  </option>
                ))}
              </select>
            </div>

            {/* 직무 선택 */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                직무 선택
              </label>
              <select
                value={selectedJobCategory}
                onChange={(e) => setSelectedJobCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="전체">전체</option>
                <option value="프론트엔드 개발자">프론트엔드 개발자</option>
                <option value="백엔드 개발자">백엔드 개발자</option>
                <option value="풀스택 개발자">풀스택 개발자</option>
                <option value="PM">PM</option>
                <option value="데이터 분석가">데이터 분석가</option>
                <option value="디자이너">디자이너</option>
              </select>
            </div>

            {/* 경력 범위 */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                경력 범위
              </label>
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
          </div>

          {/* 지원자 테이블 */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">
                    지원 공고
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">
                    지원자
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">
                    나이
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">
                    주요 스킬
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">
                    경력
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">
                    지원일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    onClick={() => handleApplicantClick(applicant.id)}
                    className="transition cursor-pointer hover:bg-gray-50"
                  >
                    {/* 지원 공고 */}
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) =>
                          handleJobPostingClick(applicant.jobPosting, e)
                        }
                        className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                      >
                        {applicant.jobPosting}
                      </button>
                    </td>

                    {/* 지원자 */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(
                            applicant.id
                          )} flex items-center justify-center text-white font-bold`}
                        >
                          {getInitials(applicant.name)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {applicant.name}
                        </span>
                      </div>
                    </td>

                    {/* 나이 */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600">
                        {applicant.age}세
                      </span>
                    </td>

                    {/* 주요 스킬 */}
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

                    {/* 경력 */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                        {applicant.experience}
                      </span>
                    </td>

                    {/* 지원일 */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {applicant.appliedDate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 검색 결과 없음 */}
          {filteredApplicants.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              <div className="mb-4 text-4xl">📭</div>
              <div className="text-lg font-medium">
                해당 조건의 지원자가 없습니다
              </div>
              <div className="text-sm">다른 조건으로 검색해보세요</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
