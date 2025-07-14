/**
 * Hook personnalisé pour gérer les vues responsives
 * 
 * Ce hook gère automatiquement :
 * - La détection mobile/desktop
 * - La navigation entre vues sur mobile
 * - Le retour automatique à la vue principale sur desktop
 * 
 * @returns {Object} - Objet contenant l'état et les méthodes de gestion
 */

import { useState, useEffect } from 'react';

export type ViewType = 'main' | 'preview';

interface UseResponsiveViewReturn {
  /** Indique si l'écran est en mode mobile */
  isMobile: boolean;
  /** Vue active sur mobile ('main' ou 'preview') */
  activeView: ViewType;
  /** Fonction pour changer la vue active */
  setActiveView: (view: ViewType) => void;
  /** Fonction pour basculer entre les vues */
  toggleView: () => void;
}

/**
 * Hook pour gérer les vues responsives mobile/desktop
 * 
 * @example
 * ```tsx
 * const { isMobile, activeView, setActiveView } = useResponsiveView();
 * 
 * if (isMobile) {
 *   return activeView === 'main' ? <MainView /> : <PreviewView />;
 * }
 * 
 * return (
 *   <div className="grid grid-cols-2">
 *     <MainView />
 *     <PreviewView />
 *   </div>
 * );
 * ```
 */
export const useResponsiveView = (): UseResponsiveViewReturn => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ViewType>('main');

  useEffect(() => {
    /**
     * Vérifie si l'écran est en mode mobile
     * Point de rupture : 768px (md breakpoint de Tailwind)
     */
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Sur desktop, toujours revenir à la vue principale
      if (!mobile) {
        setActiveView('main');
      }
    };

    // Vérification initiale
    checkIsMobile();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkIsMobile);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  /**
   * Bascule entre les vues main et preview
   */
  const toggleView = () => {
    setActiveView(prev => prev === 'main' ? 'preview' : 'main');
  };

  return {
    isMobile,
    activeView,
    setActiveView,
    toggleView,
  };
};
