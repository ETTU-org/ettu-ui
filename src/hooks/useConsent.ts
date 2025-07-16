/**
 * Hook pour gérer le consentement cookies/localStorage
 * 
 * @file useConsent.ts
 * @author ETTU Team
 * @date 2025-07-16
 */

import { useState, useEffect, useCallback } from 'react';

export type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface ConsentState {
  status: ConsentStatus;
  timestamp: Date | null;
  showBanner: boolean;
}

const CONSENT_STORAGE_KEY = 'ettu-consent';

export const useConsent = () => {
  const [consentState, setConsentState] = useState<ConsentState>({
    status: 'pending',
    timestamp: null,
    showBanner: true
  });

  // Charger le consentement existant
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsentState({
          status: parsed.status,
          timestamp: parsed.timestamp ? new Date(parsed.timestamp) : null,
          showBanner: parsed.status === 'pending'
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du consentement:', error);
    }
  }, []);

  // Sauvegarder le consentement
  const saveConsent = useCallback((status: ConsentStatus) => {
    const newState: ConsentState = {
      status,
      timestamp: new Date(),
      showBanner: false
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
        status,
        timestamp: newState.timestamp?.toISOString()
      }));
      setConsentState(newState);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du consentement:', error);
    }
  }, []);

  // Accepter les cookies
  const acceptCookies = useCallback(() => {
    saveConsent('accepted');
  }, [saveConsent]);

  // Refuser les cookies
  const declineCookies = useCallback(() => {
    saveConsent('declined');
  }, [saveConsent]);

  // Réinitialiser le consentement (pour les paramètres)
  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      setConsentState({
        status: 'pending',
        timestamp: null,
        showBanner: true
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du consentement:', error);
    }
  }, []);

  return {
    ...consentState,
    acceptCookies,
    declineCookies,
    resetConsent,
    hasConsent: consentState.status === 'accepted'
  };
};
