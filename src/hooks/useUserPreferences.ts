/**
 * Hook pour gérer les préférences utilisateur avec stockage sécurisé
 * 
 * @file useUserPreferences.ts
 * @author BOSSIS--GUYON Jules
 * @date 2025-07-14
 */

import { useSecureStorage } from './useSecureStorage';
import type { StorageOptions } from '../utils/secureStorage';

/**
 * Interface pour les préférences utilisateur
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  autoSaveInterval: number; // en secondes
  editorWordWrap: boolean;
  showLineNumbers: boolean;
  tabSize: number;
  notifications: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  developerMode: boolean;
}

/**
 * Préférences par défaut
 */
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  language: 'fr',
  fontSize: 'medium',
  autoSave: true,
  autoSaveInterval: 2, // 2 secondes
  editorWordWrap: true,
  showLineNumbers: true,
  tabSize: 2,
  notifications: true,
  soundEnabled: false,
  compactMode: false,
  developerMode: false,
};

/**
 * Hook pour gérer les préférences utilisateur
 * 
 * Les préférences sont stockées de manière sécurisée avec une durée de vie de 1 an
 * 
 * @returns Objet contenant les préférences et les fonctions de gestion
 */
export function useUserPreferences() {
  const storageOptions: StorageOptions = {
    ttl: 365 * 24 * 60 * 60 * 1000, // 1 an
    validate: true,
    compress: true,
  };

  const [preferences, setPreferences] = useSecureStorage<UserPreferences>(
    'user-preferences',
    defaultPreferences,
    storageOptions
  );

  /**
   * Met à jour une préférence spécifique
   */
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const currentPreferences = preferences || defaultPreferences;
    const updatedPreferences = {
      ...currentPreferences,
      [key]: value
    };
    setPreferences(updatedPreferences);
  };

  /**
   * Met à jour plusieurs préférences à la fois
   */
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const currentPreferences = preferences || defaultPreferences;
    const updatedPreferences = {
      ...currentPreferences,
      ...updates
    };
    setPreferences(updatedPreferences);
  };

  /**
   * Remet les préférences à leur valeur par défaut
   */
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  /**
   * Exporte les préférences au format JSON
   */
  const exportPreferences = () => {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      preferences: preferences || defaultPreferences,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ettu-preferences-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Importe les préférences depuis un fichier JSON
   */
  const importPreferences = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const data = JSON.parse(result);
            
            // Valider la structure des données
            if (data.preferences && typeof data.preferences === 'object') {
              // Fusionner avec les préférences par défaut pour éviter les valeurs manquantes
              const importedPreferences = {
                ...defaultPreferences,
                ...data.preferences,
              };
              
              setPreferences(importedPreferences);
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Erreur lors de l\'importation des préférences:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  };

  return {
    preferences: preferences || defaultPreferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
  };
}

/**
 * Hook spécialisé pour les préférences d'éditeur
 */
export function useEditorPreferences() {
  const { preferences, updatePreference } = useUserPreferences();
  
  return {
    wordWrap: preferences.editorWordWrap,
    lineNumbers: preferences.showLineNumbers,
    tabSize: preferences.tabSize,
    fontSize: preferences.fontSize,
    autoSave: preferences.autoSave,
    autoSaveInterval: preferences.autoSaveInterval,
    setWordWrap: (value: boolean) => updatePreference('editorWordWrap', value),
    setLineNumbers: (value: boolean) => updatePreference('showLineNumbers', value),
    setTabSize: (value: number) => updatePreference('tabSize', value),
    setFontSize: (value: UserPreferences['fontSize']) => updatePreference('fontSize', value),
    setAutoSave: (value: boolean) => updatePreference('autoSave', value),
    setAutoSaveInterval: (value: number) => updatePreference('autoSaveInterval', value),
  };
}

/**
 * Hook spécialisé pour les préférences de thème
 */
export function useThemePreferences() {
  const { preferences, updatePreference } = useUserPreferences();
  
  return {
    theme: preferences.theme,
    compactMode: preferences.compactMode,
    setTheme: (value: UserPreferences['theme']) => updatePreference('theme', value),
    setCompactMode: (value: boolean) => updatePreference('compactMode', value),
  };
}

export default useUserPreferences;
