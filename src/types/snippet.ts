/**
 * Types pour le module Snippets
 * 
 * Ce fichier définit les types TypeScript utilisés pour la gestion
 * des extraits de code (snippets) dans l'application ETTU.
 */

/**
 * Interface principale représentant un snippet de code
 * 
 * @interface Snippet
 */
export interface Snippet {
  /** Identifiant unique du snippet (UUID ou timestamp) */
  id: string;
  
  /** Titre/nom du snippet (ex: "Fonction de debounce") */
  title: string;
  
  /** Langage de programmation (ex: "JavaScript", "Python") */
  language: string;
  
  /** Code source du snippet */
  code: string;
  
  /** Description optionnelle du snippet */
  description: string;
  
  /** Tags pour l'organisation et la recherche */
  tags: string[];
  
  /** Nom du projet associé */
  project: string;
  
  /** Date de création */
  createdAt: Date;
  
  /** Date de dernière modification */
  updatedAt: Date;
}

/**
 * Type pour les données de formulaire lors de la création/édition
 * 
 * Exclut les champs générés automatiquement (id, dates)
 * 
 * @type SnippetFormData
 */
export type SnippetFormData = Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Énumération des catégories de langages supportés
 * 
 * Utilisé pour organiser les langages dans l'interface
 */
export const LanguageCategories = {
  WEB_FRONTEND: "Web Frontend",
  BACKEND_SYSTEMS: "Backend & Systems", 
  SCRIPTING_SHELL: "Scripting & Shell",
  DATA_ANALYTICS: "Data & Analytics",
  DEVOPS_CONFIG: "DevOps & Config",
  DOCUMENTATION: "Documentation"
} as const;

/**
 * Type pour les options de filtrage
 * 
 * @interface FilterOptions
 */
export interface FilterOptions {
  /** Terme de recherche textuelle */
  searchTerm: string;
  
  /** Filtre par langage */
  language: string;
  
  /** Filtre par projet */
  project: string;
  
  /** Filtre par tags */
  tags: string[];
}
