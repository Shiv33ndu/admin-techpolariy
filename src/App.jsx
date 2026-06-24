import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ArticlesPage from "./pages/ArticlesPage";

import useAuthStore from "./store/authStore";

import AdminLayout from "./components/layout/AdminLayout";

function App() {
  const token = useAuthStore(
    (state) => state.token
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [page, setPage] =
    useState("dashboard");

  if (!token) {
    return <LoginPage />;
  }

  return (
    <AdminLayout
      page={page}
      setPage={setPage}
      logout={logout}
    >
      {page === "dashboard" ? (
        <DashboardPage token={token} />
      ) : (
        <ArticlesPage token={token} />
      )}
    </AdminLayout>
  );
}


export default App;