/**
 * Composant d'onglets pour navigation mobile
 *
 * Affiche des onglets de navigation pour basculer entre différentes vues
 * sur mobile. Masqué automatiquement sur desktop.
 *
 * @component
 * @example
 * ```tsx
 * <MobileTabs
 *   activeTab="main"
 *   onTabChange={setActiveView}
 *   tabs={[
 *     { id: 'main', label: 'Éditeur', icon: '✏️' },
 *     { id: 'preview', label: 'Aperçu', icon: '👁️' }
 *   ]}
 * />
 * ```
 */

import type { ViewType } from "../hooks/useResponsiveView";

interface Tab {
  /** Identifiant unique de l'onglet */
  id: ViewType;
  /** Label affiché sur l'onglet */
  label: string;
  /** Icône optionnelle (emoji ou composant) */
  icon?: string;
}

interface MobileTabsProps {
  /** Onglet actuellement actif */
  activeTab: ViewType;
  /** Callback appelé lors du changement d'onglet */
  onTabChange: (tab: ViewType) => void;
  /** Liste des onglets à afficher */
  tabs: Tab[];
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant d'onglets pour la navigation mobile
 *
 * @param props - Les propriétés du composant
 * @returns Le composant d'onglets ou null si pas sur mobile
 */
export default function MobileTabs({
  activeTab,
  onTabChange,
  tabs,
  className = "",
}: MobileTabsProps) {
  return (
    <div
      className={`md:hidden bg-gray-800 border-b border-gray-700 ${className}`}
    >
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-400 bg-gray-700"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
