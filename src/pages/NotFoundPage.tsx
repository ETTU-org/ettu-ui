import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";

export default function NotFoundPage() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        {/* Icône 404 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-600 mb-4">404</div>
          <div className="text-2xl font-semibold text-red-400 mb-2">
            Page non trouvée
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="max-w-md mb-8">
          <p className="text-gray-300 text-lg mb-4">
            Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <p className="text-gray-400 text-sm">
            Vous allez être redirigé vers la page d'accueil dans{" "}
            <span className="font-semibold text-blue-400">{countdown}</span>{" "}
            seconde{countdown > 1 ? "s" : ""}.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
          >
            Retour à l'accueil
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-colors duration-200"
          >
            Page précédente
          </button>
        </div>

        {/* Liens utiles */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Vous cherchez peut-être :
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              Accueil
            </a>
            <a
              href="/notes"
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              Éditeur de notes
            </a>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-8 w-full max-w-xs">
          <div className="bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Redirection automatique en cours...
          </p>
        </div>
      </div>
    </Layout>
  );
}
