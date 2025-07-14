import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage";
import NotFoundPage from "./pages/NotFoundPage";
import SnippetsPage from "./pages/SnippetsPage";
import CGUPage from "./pages/CGUPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import LegalNoticePage from "./pages/LegalNoticePage";
import LegalPage from "./pages/LegalPage";
import AdminStoragePage from "./pages/AdminStoragePage";
import TestPage from "./pages/TestPage";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/cgu" element={<CGUPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />
        <Route path="/admin/storage" element={<AdminStoragePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
