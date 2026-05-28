const items = [
  {
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "articles",
    label: "Articles",
  },
];

export default function Sidebar({
  page,
  setPage,
  logout,
}) {
  return (
    <aside className="w-60 bg-white border-r h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">
        TechPolarity
      </h1>

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full text-left p-3 rounded-lg ${
              page === item.id
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        onClick={logout}
        className="mt-10 text-red-500"
      >
        Logout
      </button>
    </aside>
  );
}