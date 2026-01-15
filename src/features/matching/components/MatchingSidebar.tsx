import LeftSidebar from "../../../components/LeftSidebar";

interface MatchingSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function MatchingSidebar({
  activeMenu,
  onMenuClick,
}: MatchingSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
