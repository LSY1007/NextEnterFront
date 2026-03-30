import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import HoverMenu from "../features/navigation-menu/components/HoverMenu";
import DropdownMenu from "../features/navigation-menu/components/DropdownMenu";
import { useAuthStore } from "../stores/authStore";
import { logout as logoutApi } from "../api/auth";
import { checkNavigationBlocked } from "../utils/navigationBlocker";
import { getUnreadCount } from "../api/notification";
import { websocketService, NotificationMessage } from "../services/websocket";

const MENU_CLOSE_DELAY = 150;

const LOGIN_REQUIRED_MENUS = [
  "resume",
  "matching",
  "interview",
  "mypage",
  "credit",
];

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const fetchUnreadCount = async () => {
      if (isAuthenticated && user?.userId) {
        try {
          const count = await getUnreadCount("individual", user.userId);
          setUnreadCount(count);
        } catch (error) {
          setUnreadCount(0);
        }
      } else {
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);

    const handleNotificationRead = () => fetchUnreadCount();
    window.addEventListener("notification-read", handleNotificationRead);

    if (isAuthenticated && user?.userId) {
      websocketService.connect(user.userId, "individual", handleNewNotification);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("notification-read", handleNotificationRead);
      websocketService.disconnect();
    };
  }, [isAuthenticated, user, isLoading]);

  const handleNewNotification = (notification: NotificationMessage) => {
    setUnreadCount((prev) => prev + 1);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.content,
        icon: "/favicon.ico",
        tag: `notification-${notification.id}`,
      });
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/user" || path === "/user/") return "";
    if (path.startsWith("/user/jobs")) return "job";
    if (path.startsWith("/user/mypage") || path.startsWith("/user/profile")) return "mypage";
    if (path.startsWith("/user/credit")) return "credit";
    if (path.startsWith("/user/interview")) return "interview";
    if (path.startsWith("/user/resume") || path.startsWith("/user/coverletter")) return "resume";
    if (path.startsWith("/user/matching")) return "matching";
    if (path.startsWith("/user/offers")) return "offer";
    return "";
  };

  const activeTab = getActiveTab();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleMouseEnter = (tabId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredTab(tabId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
    }, MENU_CLOSE_DELAY);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    if (checkNavigationBlocked()) return;
    try {
      await logoutApi();
    } catch (error) {
      console.error("로그아웃 API 오류:", error);
    } finally {
      logout();
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      window.location.href = "/user";
    }
  };

  const handleMenuClick = (tabId: string, menuId?: string) => {
    if (checkNavigationBlocked()) return;

    const checkTabId = menuId ? menuId.split("-sub-")[0] : tabId;
    if (LOGIN_REQUIRED_MENUS.includes(checkTabId) && !isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/user/login");
      return;
    }

    const defaultSubMenus: { [key: string]: string } = {
      job: "job-sub-1",
      resume: "resume-sub-1",
      matching: "matching-sub-1",
      interview: "interview-sub-1",
      offer: "offer-sub-1",
      mypage: "mypage-home",
      credit: "credit-sub-1",
    };

    const baseRoutes: { [key: string]: string } = {
      job: "/user",
      resume: "/user/resume",
      matching: "/user/matching",
      interview: "/user/interview",
      offer: "/user/offers",
      mypage: "/user/mypage",
      credit: "/user/credit",
    };

    const separateRoutes: { [key: string]: string } = {
      "job-sub-1": "/user/jobs/all",
      "job-sub-2": "/user/jobs/ai",
      "job-sub-3": "/user/jobs/position",
      "job-sub-4": "/user/jobs/location",
      "resume-sub-2": "/user/coverletter",
      "offer-sub-2": "/user/offers/interview",
      "credit-sub-2": "/user/credit/charge",
      "mypage-sub-2": "/user/profile",
      "mypage-sub-3": "/user/application-status",
      "mypage-sub-4": "/user/offers/interview",
      "mypage-sub-5": "/user/scrap-status",
    };

    const targetMenuId = menuId || defaultSubMenus[tabId];
    const targetPath = separateRoutes[targetMenuId] || baseRoutes[tabId];

    const currentMenu = searchParams.get("menu");
    if (currentMenu === targetMenuId) {
      const timestamp = Date.now();
      navigate(`${targetPath}?menu=${targetMenuId}&reload=${timestamp}`);
      return;
    }

    if (targetPath) {
      navigate(`${targetPath}?menu=${targetMenuId}`);
    }

    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (checkNavigationBlocked()) return;
    navigate("/user");
  };

  const navItems = [
    { id: "job", label: "채용정보" },
    { id: "resume", label: "이력서" },
    { id: "matching", label: "AI 이력서 매칭" },
    { id: "interview", label: "AI 모의면접" },
    { id: "mypage", label: "마이페이지" },
    { id: "credit", label: "크레딧" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        {/* Top Header - 데스크탑만 표시 */}
        <header className={`bg-white border-b border-gray-200 transition-all duration-300 overflow-hidden hidden md:block ${
          isScrolled ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'
        }`}>
          <div className="px-4 py-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div
                onClick={handleLogoClick}
                className="transition cursor-pointer hover:opacity-80"
              >
                <span className="text-2xl font-bold text-blue-600">NextEnter</span>
              </div>

              <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <svg className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="나에게 딱 맞는 커리어와 매칭!"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                  />
                </div>
              </form>
            </div>
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className={`relative bg-white border-b border-blue-600 shadow-sm transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
          <div className="px-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between h-14">

              {/* 모바일: 로고 + 햄버거 */}
              <div className="flex items-center gap-3 md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    }
                  </svg>
                </button>
                <div onClick={handleLogoClick} className="cursor-pointer">
                  <span className="text-xl font-bold text-blue-600">NextEnter</span>
                </div>
              </div>

              {/* 데스크탑: 기존 네비 */}
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={toggleDropdown} className="p-4 transition hover:bg-gray-50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isDropdownOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    }
                  </svg>
                </button>

                {navItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`relative py-4 px-2 font-medium transition whitespace-nowrap ${
                        activeTab === item.id ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {item.label}
                      {activeTab === item.id && (
                        <span className="absolute -bottom-[1px] left-0 w-full h-0.5 bg-blue-600" />
                      )}
                    </button>
                    {hoveredTab === item.id && (
                      <HoverMenu
                        tabId={item.id}
                        onSubMenuClick={(tabId, subId) => handleMenuClick(tabId, subId)}
                        onClose={() => setHoveredTab(null)}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 오른쪽 버튼들 */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        if (checkNavigationBlocked()) return;
                        navigate("/user/notifications");
                      }}
                      className="relative p-2 text-gray-700 transition rounded-full hover:text-blue-600 hover:bg-gray-100"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
                      )}
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center px-2 md:px-4 py-2 space-x-1 md:space-x-2 text-gray-700 transition hover:text-blue-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-sm md:text-base">{user?.name}님</span>
                        <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999]">
                          <button onClick={() => { setIsUserMenuOpen(false); if (!checkNavigationBlocked()) navigate("/user/profile"); }} className="w-full px-4 py-2 text-left text-gray-700 transition hover:bg-gray-50">내 정보</button>
                          <button onClick={() => { setIsUserMenuOpen(false); if (!checkNavigationBlocked()) navigate("/user/mypage?menu=mypage-home"); }} className="w-full px-4 py-2 text-left text-gray-700 transition hover:bg-gray-50">마이페이지</button>
                          <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-600 transition hover:bg-gray-50">로그아웃</button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate("/user/login")} className="px-3 md:px-4 py-2 text-sm md:text-base text-gray-700 transition hover:text-blue-600">로그인</button>
                    <button onClick={() => navigate("/user/signup")} className="hidden md:block px-4 py-2 text-gray-700 transition hover:text-blue-600">회원가입</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* 모바일 메뉴 드롭다운 */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
            {/* 모바일 검색창 */}
            <div className="px-4 py-3 border-b border-gray-100">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <svg className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="나에게 딱 맞는 커리어와 매칭!"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </form>
            </div>

            {/* 모바일 메뉴 목록 */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full px-6 py-4 text-left font-medium border-b border-gray-50 ${
                  activeTab === item.id ? "text-blue-600 bg-blue-50" : "text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* 모바일 로그인/회원가입 */}
            {!isAuthenticated && (
              <div className="flex gap-2 px-4 py-3">
                <button onClick={() => { navigate("/user/login"); setIsMobileMenuOpen(false); }} className="flex-1 py-2 text-center text-blue-600 border border-blue-600 rounded-lg font-medium">로그인</button>
                <button onClick={() => { navigate("/user/signup"); setIsMobileMenuOpen(false); }} className="flex-1 py-2 text-center text-white bg-blue-600 rounded-lg font-medium">회원가입</button>
              </div>
            )}
          </div>
        )}

        <div className="relative z-[45]">
          <DropdownMenu
            isOpen={isDropdownOpen}
            onMenuClick={(menuId) => {
              setIsDropdownOpen(false);
              const tabId = menuId.split("-sub-")[0];
              handleMenuClick(tabId, menuId);
            }}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className={`transition-all duration-300 ${isScrolled ? 'h-[57px]' : 'h-[57px] md:h-[137px]'}`}></div>
    </>
  );
}
