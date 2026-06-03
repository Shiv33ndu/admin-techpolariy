import {
  LayoutDashboard,
  FileText,
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
];

export default function Sidebar({
  page,
  setPage,
  logout,
}) {
  return (
    <aside
      className="
        w-72
        h-screen
        bg-[#FF0000]
        border-r
        border-[#EAEAEA]
        flex
        flex-col
        justify-between
        shadow-sm
      "
    >
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="px-6 py-8 border-b border-[#EFEFEF]">
          <div className="flex items-center gap-3">
            <img
              src="/logo-techpolarity.png"
              alt="TechPolarity"
              className="h-12 w-auto object-contain"
            />

            <div>
              <h1 className="text-xl font-bold text-[#111111]">
                TechPolarity
              </h1>

              <p className="text-xs text-gray-500">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setPage(item.id)
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  duration-300
                  font-medium

                  ${
                    page === item.id
                      ? `
                        bg-[#FF0000]
                        text-white
                        shadow-lg
                        shadow-red-100
                      `
                      : `
                        text-[#333333]
                        hover:bg-white
                        hover:shadow-sm
                      `
                  }
                `}
              >
                <Icon size={20} />

                <span>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#EFEFEF]">
        <button
          onClick={logout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-2xl
            text-red-500
            hover:bg-red-50
            transition-all
            duration-300
          "
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>

        <div className="mt-4 px-2">
          <p className="text-xs text-gray-400">
            TechPolarity CMS v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}