import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ user }) => {
  const [searchValue, setSearchValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("admin_theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("admin_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-page dark:bg-gray-950">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="md:pl-64">
        <Header
          user={user}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((prev) => !prev)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <main className="p-4 md:p-6">
          <Outlet context={{ globalSearch: searchValue, currentUser: user }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
