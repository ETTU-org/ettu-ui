/**
 * Composant bandeau de consentement cookies
 * 
 * @file CookieBanner.tsx
 * @author ETTU Team
 * @date 2025-07-16
 */

import { useState } from 'react';
import { Cookie, Shield, Info } from 'lucide-react';
import { useConsent } from '../hooks/useConsent';

export default function CookieBanner() {
  const { acceptCookies, declineCookies, showBanner } = useConsent();
  const [showDetails, setShowDetails] = useState(false);

  // N'affiche le bandeau que si le consentement n'est pas encore donné
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Consentement pour les cookies et le stockage local
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Nous utilisons le stockage local de votre navigateur pour sauvegarder vos données 
                (notes, snippets, projets) et améliorer votre expérience. Vos données restent 
                privées et ne quittent jamais votre appareil.
              </p>
              
              {showDetails && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Détails du stockage
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• <strong>Notes et snippets</strong> : Stockage chiffré AES-256</li>
                    <li>• <strong>Projets et tâches</strong> : Stockage local sécurisé</li>
                    <li>• <strong>Préférences</strong> : Thème, langue, paramètres</li>
                    <li>• <strong>Aucun tracking</strong> : Pas de cookies de suivi</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Toutes vos données restent sur votre appareil
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showDetails ? 'Masquer' : 'Détails'}
            </button>
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Refuser
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
