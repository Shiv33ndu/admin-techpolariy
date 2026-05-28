import Sidebar from "./Sidebar";

export default function AdminLayout({
  children,
  page,
  setPage,
  logout,
}) {
  return (
    <div className="flex">
      <Sidebar
        page={page}
        setPage={setPage}
        logout={logout}
      />

      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
}