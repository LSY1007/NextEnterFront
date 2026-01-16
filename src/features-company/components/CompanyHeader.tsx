import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutApi } from "../../api/auth";

const MENU_CLOSE_DELAY = 150;

const LOGIN_REQUIRED_MENUS = ["jobs", "applicants", "talent", "ads", "credit"];

export default function CompanyHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith("/company/jobs")) return "jobs";
    if (path.startsWith("/company/applicants")) return "applicants";
    if (path.startsWith("/company/talent-search")) return "talent";
    if (path.startsWith("/company/ads")) return "ads";
    if (path.startsWith("/company/credit")) return "credit";
    return "";
  };

  const activeTab = getActiveTab();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색:", searchQuery);
  };

  const handleMouseEnter = (tabId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredTab(tabId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
    }, MENU_CLOSE_DELAY);
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("로그아웃 API 오류:", error);
    } finally {
      logout();
      setIsUserMenuOpen(false);
      window.location.href = "/company";
    }
  };

  const handleMenuClick = (tabId: string) => {
    if (LOGIN_REQUIRED_MENUS.includes(tabId) && !isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/company/login");
      return;
    }

    const routes: { [key: string]: string } = {
      jobs: "/company/jobs",
      applicants: "/company/applicants",
      talent: "/company/talent-search",
      ads: "/company/ads",
      credit: "/company/credit",
    };

    const targetPath = routes[tabId];
    if (targetPath) {
      navigate(targetPath);
    }
  };

  const handleLogoClick = () => {
    navigate("/company");
  };

  const navItems = [
    { id: "jobs", label: "채용공고 관리" },
    { id: "applicants", label: "지원자 관리" },
    { id: "talent", label: "인재 검색" },
    { id: "ads", label: "광고 관리" },
    { id: "credit", label: "크레딧" },
  ];

  // 서브메뉴 데이터
  const subMenus: { [key: string]: { id: string; label: string; path: string }[] } = {
    jobs: [
      { id: "jobs-list", label: "공고 목록", path: "/company/jobs" },
      { id: "jobs-create", label: "공고 등록", path: "/company/jobs/create" },
    ],
    applicants: [
      { id: "applicants-list", label: "지원자 목록", path: "/company/applicants" },
    ],
    talent: [
      { id: "talent-search", label: "인재 검색", path: "/company/talent-search" },
    ],
    ads: [
      { id: "ads-list", label: "광고 목록", path: "/company/ads" },
      { id: "ads-create", label: "광고 등록", path: "/company/ads/create" },
    ],
    credit: [
      { id: "credit-main", label: "크레딧 관리", path: "/company/credit" },
      { id: "credit-charge", label: "크레딧 충전", path: "/company/credit/charge" },
    ],
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                onClick={handleLogoClick}
                className="transition cursor-pointer hover:opacity-80"
              >
                <span className="text-2xl font-bold text-purple-600">
                  NextEnter
                </span>
                <span className="ml-2 text-sm font-medium text-purple-400">
                  기업
                </span>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <svg
                  className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="인재를 검색하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500"
                />
              </div>
            </form>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition hover:text-purple-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="font-medium">{user?.name || "기업"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999]">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/company/credit");
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 transition hover:bg-gray-50"
                      >
                        크레딧 관리
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 transition hover:bg-gray-50"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/company/login")}
                    className="px-4 py-2 text-gray-700 transition hover:text-purple-600"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => navigate("/company/signup")}
                    className="px-4 py-2 text-gray-700 transition hover:text-purple-600"
                  >
                    회원가입
                  </button>
                </>
              )}
              <button
                onClick={() => navigate("/user")}
                className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                개인 서비스
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="relative z-50 bg-white border-b-2 border-purple-600">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`py-4 px-2 font-medium transition whitespace-nowrap ${
                    activeTab === item.id
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  {item.label}
                </button>

                {/* 서브메뉴 호버 */}
                {hoveredTab === item.id && subMenus[item.id] && (
                  <div
                    className="absolute left-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-[100]"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {subMenus[item.id].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          if (!isAuthenticated) {
                            alert("로그인이 필요한 기능입니다.");
                            navigate("/company/login");
                            return;
                          }
                          navigate(sub.path);
                        }}
                        className="block w-full px-4 py-3 text-left text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
