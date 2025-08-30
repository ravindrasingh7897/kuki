import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Dashboard = () => {
  return <DashboardLayout onLogout={() => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    window.location.replace("/login");
  }} />;
};

export default Dashboard;
