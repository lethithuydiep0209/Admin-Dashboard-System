import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ user }) => {
  const [searchValue, setSearchValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="md:pl-64">
        <Header user={user} searchValue={searchValue} onSearchChange={setSearchValue} />
        <main className="p-4 md:p-6">
          <Outlet context={{ globalSearch: searchValue }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
