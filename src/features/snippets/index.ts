/**
 * Module Snippets - Point d'entrée principal
 * 
 * Ce module fournit une solution complète pour la gestion d'extraits de code
 * dans une application React/TypeScript.
 * 
 * Fonctionnalités principales :
 * - Création et édition de snippets
 * - Filtrage et recherche
 * - Support de 43 langages de programmation
 * - Interface responsive et moderne
 * - Éditeur de code avec coloration syntaxique
 * 
 * @module Snippets
 * @version 1.0.0
 * @author ETTU Development Team
 */

// Composants principaux
export { default as SnippetList } from './SnippetList';
export { default as SnippetEditor } from './SnippetEditor';

// Types TypeScript
export type { Snippet, SnippetFormData, FilterOptions, LanguageCategories } from '../../types/snippet';

// Réexport de la page principale pour faciliter l'import
export { default as SnippetsPage } from '../../pages/SnippetsPage';

/**
 * Métadonnées du module
 */
export const SNIPPET_MODULE_INFO = {
  name: 'Snippets',
  version: '1.0.0',
  description: 'Module de gestion d\'extraits de code',
  supportedLanguages: 43,
  categories: 6,
  features: [
    'Création et édition de snippets',
    'Filtrage par langage et projet',
    'Recherche textuelle',
    'Coloration syntaxique',
    'Gestion des tags',
    'Copie vers le presse-papiers',
    'Interface responsive',
    'Thème sombre',
  ],
  dependencies: [
    '@codemirror/lang-javascript',
    '@codemirror/lang-python',
    '@codemirror/lang-html',
    '@codemirror/lang-css',
    '@codemirror/lang-json',
    '@codemirror/lang-markdown',
  ],
} as const;

/**
 * Langages supportés par le module
 */
export const SUPPORTED_LANGUAGES = [
  // Web Frontend
  'javascript', 'typescript', 'html', 'css', 'scss', 'less', 'jsx', 'tsx',
  
  // Backend & Systems
  'python', 'rust', 'go', 'java', 'c', 'c++', 'c#', 'php', 'ruby',
  'kotlin', 'swift', 'dart', 'scala', 'elixir',
  
  // Scripting & Shell
  'bash', 'shell', 'powershell', 'makefile',
  
  // Data & Analytics
  'r', 'julia', 'matlab', 'sql',
  
  // DevOps & Config
  'dockerfile', 'yaml', 'json', 'toml', 'ini', 'terraform',
  'ansible', 'nginx', 'apache',
  
  // Documentation
  'markdown', 'restructuredtext', 'latex', 'xml',
] as const;

/**
 * Catégories de langages
 */
export const LANGUAGE_CATEGORIES = {
  'Web Frontend': [
    'javascript', 'typescript', 'html', 'css', 'scss', 'less', 'jsx', 'tsx'
  ],
  'Backend & Systems': [
    'python', 'rust', 'go', 'java', 'c', 'c++', 'c#', 'php', 'ruby',
    'kotlin', 'swift', 'dart', 'scala', 'elixir'
  ],
  'Scripting & Shell': [
    'bash', 'shell', 'powershell', 'makefile'
  ],
  'Data & Analytics': [
    'r', 'julia', 'matlab', 'sql'
  ],
  'DevOps & Config': [
    'dockerfile', 'yaml', 'json', 'toml', 'ini', 'terraform',
    'ansible', 'nginx', 'apache'
  ],
  'Documentation': [
    'markdown', 'restructuredtext', 'latex', 'xml'
  ],
} as const;

/**
 * Utilitaires du module
 */
export const SnippetUtils = {
  /**
   * Génère un ID unique pour un nouveau snippet
   */
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Valide les données d'un snippet
   */
  validateSnippet: (data: unknown): boolean => {
    if (typeof data !== 'object' || data === null) {
      return false;
    }
    
    const snippet = data as Record<string, unknown>;
    return Boolean(
      snippet.title &&
      snippet.language &&
      snippet.code &&
      snippet.description &&
      Array.isArray(snippet.tags) &&
      snippet.project
    );
  },

  /**
   * Formate la date pour l'affichage
   */
  formatDate: (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  /**
   * Nettoie et normalise un nom de langage
   */
  normalizeLanguage: (language: string): string => {
    return language.toLowerCase().trim();
  },

  /**
   * Filtre les snippets selon les critères donnés
   */
  filterSnippets: <T extends { title: string; description: string; code: string; language: string; project: string }>(
    snippets: T[],
    searchTerm: string,
    languageFilter: string,
    projectFilter: string
  ): T[] => {
    return snippets.filter(snippet => {
      const matchesSearch = !searchTerm || 
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLanguage = !languageFilter || snippet.language === languageFilter;
      const matchesProject = !projectFilter || snippet.project === projectFilter;
      
      return matchesSearch && matchesLanguage && matchesProject;
    });
  },
} as const;
