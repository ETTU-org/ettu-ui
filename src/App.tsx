import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DevAuthProvider } from "./contexts/DevAuthContext.tsx";
import DevRouteGuard from "./components/DevRouteGuard";
import DevOnlyRoute from "./components/DevOnlyRoute";
import DevLoginRoute from "./components/DevLoginRoute";
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage";
import NotFoundPage from "./pages/NotFoundPage";
import SnippetsPage from "./pages/SnippetsPage";
import TodosPage from "./pages/TodosPage";
import ProjectsPage from "./pages/ProjectsPage";
import CGUPage from "./pages/CGUPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import LegalNoticePage from "./pages/LegalNoticePage";
import LegalPage from "./pages/LegalPage";
import AdminStoragePage from "./pages/AdminStoragePage";
import TestPage from "./pages/TestPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import DevLoginPage from "./pages/DevLoginPage";
import "./App.css";

export default function App() {
  return (
    <DevAuthProvider>
      <Router>
        <DevRouteGuard>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/snippets" element={<SnippetsPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/cgu" element={<CGUPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/legal-notice" element={<LegalNoticePage />} />

            {/* Route de login dev - uniquement sur port 5199 */}
            <Route
              path="/dev/login"
              element={
                <DevLoginRoute>
                  <DevLoginPage />
                </DevLoginRoute>
              }
            />

            {/* Routes de développement - uniquement sur port 5199 */}
            <Route
              path="/admin"
              element={
                <DevOnlyRoute>
                  <AdminPanelPage />
                </DevOnlyRoute>
              }
            />
            <Route
              path="/admin/storage"
              element={
                <DevOnlyRoute>
                  <AdminStoragePage />
                </DevOnlyRoute>
              }
            />
            <Route
              path="/test"
              element={
                <DevOnlyRoute>
                  <TestPage />
                </DevOnlyRoute>
              }
            />

            {/* Route 404 explicite */}
            <Route path="/404" element={<NotFoundPage />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </DevRouteGuard>
      </Router>
    </DevAuthProvider>
  );
}
