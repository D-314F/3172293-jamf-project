import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/bf-2.png";
import { Navbar } from "@/shared";
import Footer from "./Footer";

export default function DashboardLayout() {
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <main className="flex-grow mx-auto">
        <Outlet />
      </main>

      <Footer /> 
    </div>
  );
}
