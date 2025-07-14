import { useDevAuth } from '../hooks/useDevAuth';
import { Link } from 'react-router-dom';

export default function DevWelcomeBanner() {
  const { isDevMode } = useDevAuth();

  if (!isDevMode) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-900 to-orange-900 border border-yellow-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🛠️</div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-100">
              Mode Développement Activé
            </h3>
            <p className="text-yellow-200 text-sm">
              Vous êtes connecté sur le port {window.location.port} avec les outils de développement
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/admin"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Panel Admin
          </Link>
          <Link
            to="/test"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Tests
          </Link>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-yellow-800 bg-opacity-50 rounded p-3">
          <div className="font-medium text-yellow-100 mb-1">🔒 Sécurité</div>
          <div className="text-yellow-200">
            Tests XSS, validation, CSP active
          </div>
        </div>
        <div className="bg-yellow-800 bg-opacity-50 rounded p-3">
          <div className="font-medium text-yellow-100 mb-1">💾 Stockage</div>
          <div className="text-yellow-200">
            Chiffrement AES-256, tests intégrés
          </div>
        </div>
        <div className="bg-yellow-800 bg-opacity-50 rounded p-3">
          <div className="font-medium text-yellow-100 mb-1">📊 Monitoring</div>
          <div className="text-yellow-200">
            Logs sécurité, métriques temps réel
          </div>
        </div>
      </div>
    </div>
  );
}
