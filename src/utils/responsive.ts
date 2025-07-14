/**
 * Index des outils responsifs
 * 
 * Exporte tous les composants et hooks nécessaires pour créer
 * des interfaces responsives avec navigation mobile/desktop.
 */

// Hook principal
export { useResponsiveView } from '../hooks/useResponsiveView';
export type { ViewType } from '../hooks/useResponsiveView';

// Composants
export { default as MobileTabs } from '../components/MobileTabs';
export { default as ResponsiveLayout } from '../components/ResponsiveLayout';
