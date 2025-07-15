/**
 * Layout responsif pour les interfaces à deux colonnes
 *
 * Ce composant gère automatiquement l'affichage :
 * - Desktop : 2 colonnes côte à côte
 * - Mobile : 1 colonne avec navigation par onglets
 *
 * @component
 * @example
 * ```tsx
 * <ResponsiveLayout
 *   mainContent={<NoteEditor />}
 *   previewContent={<NotePreview />}
 *   tabs={[
 *     { id: 'main', label: 'Éditeur', icon: '✏️' },
 *     { id: 'preview', label: 'Aperçu', icon: '👁️' }
 *   ]}
 * />
 * ```
 */

import type { ReactNode } from "react";
import { useResponsiveView, type ViewType } from "../hooks/useResponsiveView";
import MobileTabs from "./MobileTabs";

interface Tab {
  id: ViewType;
  label: string;
  icon?: string;
}

interface ResponsiveLayoutProps {
  /** Contenu principal (éditeur, liste, etc.) */
  mainContent: ReactNode;
  /** Contenu de prévisualisation */
  previewContent: ReactNode;
  /** Configuration des onglets pour mobile */
  tabs: Tab[];
  /** Classes CSS additionnelles pour le conteneur */
  className?: string;
  /** Proportions des colonnes sur desktop (défaut: 1:1) */
  gridCols?: string;
}

/**
 * Layout responsif avec gestion automatique mobile/desktop
 *
 * @param props - Les propriétés du composant
 * @returns Le layout adaptatif
 */
export default function ResponsiveLayout({
  mainContent,
  previewContent,
  tabs,
  className = "",
  gridCols = "md:grid-cols-2",
}: ResponsiveLayoutProps) {
  const { isMobile, activeView, setActiveView } = useResponsiveView();

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Onglets mobiles */}
      {isMobile && (
        <MobileTabs
          activeTab={activeView}
          onTabChange={setActiveView}
          tabs={tabs}
        />
      )}

      {/* Contenu principal */}
      <div
        className={`flex-1 overflow-hidden ${
          isMobile ? "block" : `grid ${gridCols} gap-4`
        }`}
      >
        {/* Vue principale */}
        <div
          className={`${
            isMobile && activeView !== "main" ? "hidden" : "block"
          } ${isMobile ? "h-full" : ""}`}
        >
          {mainContent}
        </div>

        {/* Vue de prévisualisation */}
        <div
          className={`${
            isMobile && activeView !== "preview" ? "hidden" : "block"
          } ${isMobile ? "h-full" : ""}`}
        >
          {previewContent}
        </div>
      </div>
    </div>
  );
}
