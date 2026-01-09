import { useState } from "react";
import Footer from "../components/Footer";

interface JobPostingCreatePageProps {
  onBackClick?: () => void;
  onLogoClick?: () => void;
}

export default function JobPostingCreatePage({ onBackClick, onLogoClick }: JobPostingCreatePageProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    manager: "",
    contact: "",
    location: "",
    position: "",
    mainSkill: "",
    careerRequired: false,
    careerFree: false,
    benefits: "",
    requirements: "",
    workStartTime: "09:00",
    workDays: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // 경력 체크박스 배타적 선택
        ...(name === "careerRequired" && checked ? { careerFree: false } : {}),
        ...(name === "careerFree" && checked ? { careerRequired: false } : {})
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 실제 등록 로직 추가
    alert("공고가 성공적으로 등록되었습니다! 🎉");
    if (onBackClick) {
      onBackClick();
    }
  };

  const handleGoToMain = () => {
    // 메인 페이지로 이동
    if (onLogoClick) {
      onLogoClick();
    } else {
      console.log("메인 페이지로 이동");
    }
  };

  const handleCancel = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div 
              onClick={handleGoToMain}
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
                onClick={handleGoToMain}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 타이틀 배너 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white text-center">새 공고 등록</h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* 왼쪽: 폼 필드 (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* 공고 제목 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    공고 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="예: [신입/경력] 프론트엔드 개발자 채용"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* 담당자 & 연락처 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      담당자 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="manager"
                      value={formData.manager}
                      onChange={handleInputChange}
                      placeholder="홍길동"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* 근무지 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    근무지 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="서울특별시 강남구 테헤란로 123"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* 모집 직무 & 주경력 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      모집 직무 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">선택하세요</option>
                      <option value="frontend">프론트엔드 개발자</option>
                      <option value="backend">백엔드 개발자</option>
                      <option value="fullstack">풀스택 개발자</option>
                      <option value="mobile">모바일 개발자</option>
                      <option value="devops">DevOps 엔지니어</option>
                      <option value="data">데이터 분석가</option>
                      <option value="ai">AI/ML 엔지니어</option>
                      <option value="design">UI/UX 디자이너</option>
                      <option value="pm">프로덕트 매니저</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      주경력
                    </label>
                    <input
                      type="text"
                      name="mainSkill"
                      value={formData.mainSkill}
                      onChange={handleInputChange}
                      placeholder="예: React, TypeScript"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 요구 경력 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    요구 경력
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        name="careerRequired"
                        checked={formData.careerRequired}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700">경력 요구</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        name="careerFree"
                        checked={formData.careerFree}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700">경력 무관</span>
                    </label>
                  </div>
                </div>

                {/* 우대 사항 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    우대 사항
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    placeholder="예:&#10;- 관련 프로젝트 경험자&#10;- 팀 협업 경험자&#10;- 오픈소스 기여 경험자"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                {/* 직무 요건 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    직무 요건 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="상세한 직무 요건을 작성해주세요."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    required
                  />
                </div>

                {/* 근무 시간 & 근무 요일 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      근무 시간
                    </label>
                    <input
                      type="time"
                      name="workStartTime"
                      value={formData.workStartTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      근무 요일
                    </label>
                    <input
                      type="text"
                      name="workDays"
                      value={formData.workDays}
                      onChange={handleInputChange}
                      placeholder="예: 월~금"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 오른쪽: 이미지 업로드 (1/3) */}
              <div className="lg:col-span-1 space-y-6">
                {/* 이미지 미리보기 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    모집 사진
                  </label>
                  <div
                    onClick={() => document.getElementById("imageInput")?.click()}
                    className={`relative w-full h-96 border-3 ${
                      imagePreview ? "border-blue-500 border-solid" : "border-dashed border-gray-300"
                    } rounded-2xl cursor-pointer hover:border-blue-400 transition-all overflow-hidden group ${
                      !imagePreview ? "bg-gray-50" : ""
                    }`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-3xl text-white shadow-lg">
                          📷
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700 mb-1">
                            모집 사진 추가
                          </div>
                          <div className="text-sm text-gray-500">
                            클릭하여 이미지를 업로드하세요
                          </div>
                        </div>
                      </div>
                    )}
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* 크레딧 정보 */}
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-yellow-900">
                      차감 크레딧
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🪙</span>
                      <span className="text-2xl font-bold text-yellow-900">200</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-4 mt-10 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                공고 등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
