import {
  LayoutDashboard,
  FileText,
  Tag,
  LogOut,
} from "lucide-react";

const items = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "articles",
    label: "Articles",
    icon: FileText,
  },
  {
    id: "categories",
    label: "Categories",
    icon: Tag,
  },
];

export default function Sidebar({ page, setPage, logout }) {
  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col justify-between shadow-lg">

      {/* Logo Section */}
      <div>
        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src="/logo-techpolarity.png"
              alt="TechPolarity"
              className="h-14 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-[#111111]">TechPolarity</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`
                  w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-medium
                  cursor-pointer transition-all duration-300 transform
                  ${active
                    ? "bg-[#FF0000] text-white shadow-lg shadow-red-200 scale-[1.02]"
                    : "text-[#222222] hover:bg-red-50 hover:text-[#FF0000] hover:translate-x-1"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100">
        <button
          onClick={logout}
          className="
            w-full flex items-center justify-center gap-3 py-4 rounded-2xl
            text-white font-semibold bg-gradient-to-r from-[#FF0000] to-[#D10000]
            shadow-lg shadow-red-200 transition-all duration-300
            hover:scale-105 hover:shadow-red-300 hover:-translate-y-1 active:scale-95 cursor-pointer
          "
        >
          <LogOut size={20} />
          Logout
        </button>

        <div className="mt-5 text-center">
          <p className="text-xs text-gray-400">TechPolarity CMS v1.0</p>
          <p className="text-[10px] text-gray-300 mt-1">Powered by TechPolarity</p>
        </div>
      </div>
    </aside>
  );
}
