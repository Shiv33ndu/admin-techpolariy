import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ArticlesPage from "./pages/ArticlesPage";
import CategoriesPage from "./pages/CategoriesPage";
import SectionsPage from "./pages/SectionsPage";
import AdminLayout from "./components/layout/AdminLayout";
import Toaster from "./components/ui/Toaster";
import useAuthStore from "./store/authStore";

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/sections" element={<SectionsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}
