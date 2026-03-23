import { Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthUser } from "../services/storage";

const Header = ({ searchValue, onSearchChange, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthUser();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-white px-4 py-3 shadow-sm md:px-6">
      <input
        value={searchValue}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder="Search..."
        className="w-full max-w-md rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <div className="flex items-center gap-4">
        <button type="button" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
          <Bell size={18} />
        </button>
        <div className="group relative">
          <button type="button" className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              {user?.name?.slice(0, 1) || "A"}
            </div>
            <span className="hidden text-sm md:block">{user?.name || "Admin"}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          <div className="invisible absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 bg-white p-1 opacity-0 shadow transition group-hover:visible group-hover:opacity-100">
            <button type="button" className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100">
              Profile
            </button>
            <button type="button" onClick={handleLogout} className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
