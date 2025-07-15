/**
 * Types pour le système de gestion de projets ETTU
 */

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface ProjectNote {
  id: string;
  title: string;
  content: string;
  type: 'brief' | 'analysis' | 'documentation' | 'research' | 'meeting' | 'idea';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  // Métadonnées pour l'organisation
  folder?: string;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface ProjectSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  type: 'function' | 'component' | 'hook' | 'utility' | 'config' | 'template';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  // Métadonnées pour l'organisation
  folder?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  // Informations techniques
  dependencies?: string[];
  usage?: string; // Exemple d'utilisation
}

export interface ProjectStructure {
  id: string;
  name: string;
  description?: string;
  color: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Statistiques
  stats: {
    totalNotes: number;
    totalSnippets: number;
    totalTasks: number;
    completedTasks: number;
    lastActivity: Date;
  };
  
  // Configuration
  settings: {
    allowPublicSharing: boolean;
    defaultNoteType: ProjectNote['type'];
    defaultSnippetLanguage: string;
  };
  
  // Métadonnées
  metadata: {
    technologies: string[];
    team?: string[];
    repository?: string;
    documentation?: string;
  };
}

export interface ProjectFilter {
  status?: ProjectStatus[];
  technologies?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  totalNotes: number;
  totalSnippets: number;
  totalTasks: number;
  projectsByStatus: Record<ProjectStatus, number>;
  recentActivity: Array<{
    type: 'note' | 'snippet' | 'task';
    action: 'created' | 'updated' | 'deleted';
    title: string;
    projectName: string;
    date: Date;
  }>;
}

// Types pour les formulaires
export interface ProjectFormData {
  name: string;
  description?: string;
  color: string;
  status: ProjectStatus;
  technologies: string[];
  team: string[];
  repository?: string;
  documentation?: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  type: ProjectNote['type'];
  tags: string[];
  folder?: string;
  isPinned?: boolean;
}

export interface SnippetFormData {
  title: string;
  description?: string;
  code: string;
  language: string;
  type: ProjectSnippet['type'];
  tags: string[];
  folder?: string;
  isPinned?: boolean;
  dependencies?: string[];
  usage?: string;
}

// Types pour les vues
export type ProjectViewMode = 'grid' | 'list' | 'kanban';
export type ProjectContentView = 'overview' | 'notes' | 'snippets' | 'tasks';

// Constantes pour la configuration
export const PROJECT_STATUSES = [
  { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-800', icon: '🟢' },
  { value: 'paused', label: 'En pause', color: 'bg-yellow-100 text-yellow-800', icon: '⏸️' },
  { value: 'completed', label: 'Terminé', color: 'bg-blue-100 text-blue-800', icon: '✅' },
  { value: 'archived', label: 'Archivé', color: 'bg-gray-100 text-gray-800', icon: '📁' }
] as const;

export const NOTE_TYPES = [
  { value: 'brief', label: 'Brief', color: 'bg-purple-100 text-purple-800', icon: '📋' },
  { value: 'analysis', label: 'Analyse', color: 'bg-blue-100 text-blue-800', icon: '🔍' },
  { value: 'documentation', label: 'Documentation', color: 'bg-green-100 text-green-800', icon: '📚' },
  { value: 'research', label: 'Recherche', color: 'bg-orange-100 text-orange-800', icon: '🔬' },
  { value: 'meeting', label: 'Réunion', color: 'bg-red-100 text-red-800', icon: '🤝' },
  { value: 'idea', label: 'Idée', color: 'bg-yellow-100 text-yellow-800', icon: '💡' }
] as const;

export const SNIPPET_TYPES = [
  { value: 'function', label: 'Fonction', color: 'bg-blue-100 text-blue-800', icon: '⚡' },
  { value: 'component', label: 'Composant', color: 'bg-green-100 text-green-800', icon: '🧩' },
  { value: 'hook', label: 'Hook', color: 'bg-purple-100 text-purple-800', icon: '🪝' },
  { value: 'utility', label: 'Utilitaire', color: 'bg-orange-100 text-orange-800', icon: '🔧' },
  { value: 'config', label: 'Configuration', color: 'bg-gray-100 text-gray-800', icon: '⚙️' },
  { value: 'template', label: 'Template', color: 'bg-pink-100 text-pink-800', icon: '📄' }
] as const;

export const PROGRAMMING_LANGUAGES = [
  'typescript', 'javascript', 'python', 'java', 'php', 'csharp', 'go', 'rust',
  'html', 'css', 'scss', 'sql', 'json', 'yaml', 'markdown', 'bash', 'powershell'
] as const;

export const COMMON_TECHNOLOGIES = [
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
  'Node.js', 'Express', 'Fastify', 'Nest.js',
  'TypeScript', 'JavaScript', 'Python', 'Java', 'PHP',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Chakra UI'
] as const;
