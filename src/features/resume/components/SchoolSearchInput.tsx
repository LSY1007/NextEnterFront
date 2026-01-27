import { useState, useEffect, useRef } from "react";
import { searchSchools, SchoolData } from "../../../api/school";

interface SchoolSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  schoolLevel?: "high" | "college" | "graduate";
  placeholder?: string;
  disabled?: boolean;
}

export default function SchoolSearchInput({
  value,
  onChange,
  schoolLevel,
  placeholder = "학교 이름을 입력하세요",
  disabled = false,
}: SchoolSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SchoolData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 검색 디바운싱
  useEffect(() => {
    if (!value || value.length < 1) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchSchools(value, schoolLevel);
        setSearchResults(results);
        setIsOpen(results.length > 0);
      } catch (error) {
        console.error("학교 검색 오류:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, schoolLevel]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (school: SchoolData) => {
    onChange(school.schoolName);
    setIsOpen(false);
    setSearchResults([]);
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500 disabled:bg-gray-100"
      />

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="absolute top-0 bottom-0 right-0 flex items-center pr-3">
          <div className="w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* 검색 결과 드롭다운 */}
      {isOpen && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60"
        >
          {searchResults.map((school, index) => (
            <button
              key={index}
              onClick={() => handleSelect(school)}
              className="flex items-center justify-between w-full px-4 py-3 text-left transition hover:bg-gray-50"
            >
              <div>
                <div className="font-medium">{school.schoolName}</div>
                <div className="text-sm text-gray-500">
                  {school.region} | {school.schoolType}
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {isOpen && !isLoading && searchResults.length === 0 && value && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full p-4 mt-1 text-center text-gray-500 bg-white border-2 border-gray-200 rounded-lg shadow-lg"
        >
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}
