import { Outlet } from "react-router-dom";
import CompanyHeader from "../features-company/components/CompanyHeader";
import Footer from "../components/Footer";

export default function CompanyLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />
      <Outlet />
      <Footer />
    </div>
  );
}
