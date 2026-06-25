import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ArticlesPage from "./pages/ArticlesPage";
import CategoriesPage from "./pages/CategoriesPage";

import useAuthStore from "./store/authStore";

import AdminLayout from "./components/layout/AdminLayout";

function App() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [page, setPage] = useState("dashboard");

  if (!token) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage token={token} />;
      case "articles":
        return <ArticlesPage token={token} />;
      case "categories":
        return <CategoriesPage token={token} />;
      default:
        return <DashboardPage token={token} />;
    }
  };

  return (
    <AdminLayout page={page} setPage={setPage} logout={logout}>
      {renderPage()}
    </AdminLayout>
  );
}

export default App;
