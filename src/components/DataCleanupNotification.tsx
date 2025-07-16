/**
 * Composant pour afficher un message de nettoyage des données
 */

import { useEffect, useState } from 'react';
import { X, Database, Trash2 } from 'lucide-react';
import { cleanupTestData, hasTestData, showDataSummary } from '../utils/cleanupTestData';

export default function DataCleanupNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const checkForTestData = hasTestData();
    setHasData(checkForTestData);
    
    if (checkForTestData) {
      setShowNotification(true);
      showDataSummary();
    }
  }, []);

  const handleCleanup = () => {
    cleanupTestData();
    setShowNotification(false);
    setHasData(false);
    // Recharger la page pour réinitialiser l'application
    window.location.reload();
  };

  if (!showNotification || !hasData) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-yellow-900/90 border border-yellow-500/50 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Database className="h-6 w-6 text-yellow-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-300">
              Données de test détectées
            </h3>
            <p className="mt-1 text-sm text-yellow-200">
              L'application contient encore des données fictives de développement. 
              Souhaitez-vous les supprimer pour préparer l'intégration du backend ?
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleCleanup}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Nettoyer les données
              </button>
              <button
                onClick={() => setShowNotification(false)}
                className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-xs font-medium rounded-md text-yellow-300 bg-transparent hover:bg-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Ignorer
              </button>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => setShowNotification(false)}
              className="inline-flex text-yellow-400 hover:text-yellow-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
