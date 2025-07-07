import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<div>Page non trouvée</div>} />
        {/* Ajouter d'autres pages ici */}
      </Routes>
    </Router>
  );
}
