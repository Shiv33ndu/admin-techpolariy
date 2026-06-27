import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Tag,
  LayoutGrid,
  LogOut,
  Zap,
} from "lucide-react";
import useAuthStore from "../../store/authStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/articles", label: "Articles", icon: FileText },
  { to: "/sections", label: "Headers", icon: LayoutGrid },
  { to: "/categories", label: "Sub-Categories", icon: Tag },
];

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-64 h-screen bg-[#111111] flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FF0000] rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-tight">
              TechPolarity
            </p>
            <p className="text-white/40 text-[11px] mt-0.5">Admin CMS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 pt-4">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
          Menu
        </p>

        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#FF0000] text-white shadow-lg shadow-red-500/25"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all duration-150"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>

        <p className="text-white/20 text-[10px] text-center mt-3">
          TechPolarity CMS v2.0
        </p>
      </div>
    </aside>
  );
}
