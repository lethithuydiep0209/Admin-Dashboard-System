import { LayoutDashboard, Users, Package, ShoppingCart, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
];

const Sidebar = ({ open, setOpen }) => (
  <>
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="fixed left-4 top-4 z-40 rounded-lg bg-primary p-2 text-white md:hidden"
    >
      <Menu size={18} />
    </button>
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 p-4 text-white transition-transform md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <h1 className="px-3 py-3 text-lg font-semibold">Admin Dashboard</h1>
      <nav className="mt-2 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);

export default Sidebar;
