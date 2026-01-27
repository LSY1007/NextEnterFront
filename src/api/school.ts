import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface SchoolData {
  schoolName: string;
  region: string;
  schoolType: string; // 고등학교, 대학교, 대학원
  address?: string;
}

/**
 * 학교 검색 API
 * @param keyword 검색 키워드
 * @param schoolLevel 학교급 (high: 고등학교, college: 대학교, graduate: 대학원)
 */
export const searchSchools = async (
  keyword: string,
  schoolLevel?: "high" | "college" | "graduate"
): Promise<SchoolData[]> => {
  try {
    const params: any = {
      keyword,
    };
    
    if (schoolLevel) {
      params.schoolLevel = schoolLevel;
    }

    const response = await axios.get(`${API_BASE_URL}/api/schools/search`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("학교 검색 오류:", error);
    // 개발 중에는 목 데이터 반환
    return getMockSchools(keyword, schoolLevel);
  }
};

/**
 * 개발용 목 데이터
 */
const getMockSchools = (keyword: string, schoolLevel?: string): SchoolData[] => {
  const mockData: SchoolData[] = [
    // 고등학교
    { schoolName: "서울고등학교", region: "서울", schoolType: "고등학교" },
    { schoolName: "대원외국어고등학교", region: "서울", schoolType: "고등학교" },
    { schoolName: "한영외국어고등학교", region: "서울", schoolType: "고등학교" },
    { schoolName: "경기고등학교", region: "서울", schoolType: "고등학교" },
    { schoolName: "부산고등학교", region: "부산", schoolType: "고등학교" },
    { schoolName: "광주제일고등학교", region: "광주", schoolType: "고등학교" },
    
    // 대학교
    { schoolName: "서울대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "연세대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "고려대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "성균관대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "한양대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "중앙대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "경희대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "서강대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "이화여자대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "한국외국어대학교", region: "서울", schoolType: "대학교" },
    { schoolName: "부산대학교", region: "부산", schoolType: "대학교" },
    { schoolName: "경북대학교", region: "대구", schoolType: "대학교" },
    { schoolName: "전남대학교", region: "광주", schoolType: "대학교" },
    { schoolName: "충남대학교", region: "대전", schoolType: "대학교" },
    { schoolName: "KAIST", region: "대전", schoolType: "대학교" },
    { schoolName: "POSTECH", region: "포항", schoolType: "대학교" },
    { schoolName: "UNIST", region: "울산", schoolType: "대학교" },
    { schoolName: "GIST", region: "광주", schoolType: "대학교" },
    
    // 대학원
    { schoolName: "서울대학교 대학원", region: "서울", schoolType: "대학원" },
    { schoolName: "연세대학교 대학원", region: "서울", schoolType: "대학원" },
    { schoolName: "고려대학교 대학원", region: "서울", schoolType: "대학원" },
    { schoolName: "KAIST 대학원", region: "대전", schoolType: "대학원" },
  ];

  // 키워드로 필터링
  let filtered = mockData.filter((school) =>
    school.schoolName.toLowerCase().includes(keyword.toLowerCase())
  );

  // 학교급 필터링
  if (schoolLevel === "high") {
    filtered = filtered.filter((s) => s.schoolType === "고등학교");
  } else if (schoolLevel === "college") {
    filtered = filtered.filter((s) => s.schoolType === "대학교");
  } else if (schoolLevel === "graduate") {
    filtered = filtered.filter((s) => s.schoolType === "대학원");
  }

  return filtered;
};
