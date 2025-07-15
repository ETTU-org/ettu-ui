/**
 * Types pour le système TODO Techniques
 */

export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoStatus = 'backlog' | 'in-progress' | 'testing' | 'done';
export type TodoType = 'feature' | 'bug' | 'refactor' | 'documentation' | 'test' | 'idea';

export interface TodoTask {
  id: string;
  title: string;
  description?: string;
  type: TodoType;
  priority: TodoPriority;
  status: TodoStatus;
  tags: string[];
  project?: string;
  assignee?: string;
  estimatedTime?: number; // en heures
  actualTime?: number; // en heures
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  order?: number; // Position dans la colonne pour le tri
  // Références aux autres fonctionnalités
  relatedNotes?: string[]; // IDs des notes liées
  relatedSnippets?: string[]; // IDs des snippets liés
  // Checklist pour les tâches complexes
  checklist?: TodoChecklistItem[];
  // Commentaires/notes sur la tâche
  comments?: TodoComment[];
}

export interface TodoChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoComment {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TodoProject {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoBoard {
  id: string;
  name: string;
  description?: string;
  columns: TodoColumn[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoColumn {
  id: string;
  title: string;
  status: TodoStatus;
  color: string;
  tasks: string[]; // IDs des tâches dans cette colonne
  maxTasks?: number; // Limite WIP (Work In Progress)
}

export interface TodoFilter {
  type?: TodoType[];
  priority?: TodoPriority[];
  status?: TodoStatus[];
  tags?: string[];
  project?: string;
  assignee?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TodoStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  tasksByType: Record<TodoType, number>;
  tasksByPriority: Record<TodoPriority, number>;
  tasksByStatus: Record<TodoStatus, number>;
  estimatedVsActualTime: {
    estimated: number;
    actual: number;
  };
}

// Types pour l'interface utilisateur
export interface TodoViewMode {
  view: 'board' | 'list' | 'calendar' | 'timeline';
}

export interface TodoFormData {
  title: string;
  description?: string;
  type: TodoType;
  priority: TodoPriority;
  status: TodoStatus;
  tags: string[];
  project?: string;
  assignee?: string;
  estimatedTime?: number;
  dueDate?: Date;
  relatedNotes?: string[];
  relatedSnippets?: string[];
}

export interface TodoDragDropResult {
  taskId: string;
  sourceStatus: TodoStatus;
  targetStatus: TodoStatus;
  sourceIndex: number;
  targetIndex: number;
}

export interface TodoExportData {
  tasks: TodoTask[];
  projects: TodoProject[];
  stats: TodoStats;
  exportDate: Date;
}

// Constantes pour la configuration
export const TODO_TYPES: { value: TodoType; label: string; icon: string; color: string }[] = [
  { value: 'feature', label: 'Fonctionnalité', icon: '✨', color: 'bg-blue-100 text-blue-800' },
  { value: 'bug', label: 'Bug', icon: '🐛', color: 'bg-red-100 text-red-800' },
  { value: 'refactor', label: 'Refactoring', icon: '🔧', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'documentation', label: 'Documentation', icon: '📚', color: 'bg-green-100 text-green-800' },
  { value: 'test', label: 'Test', icon: '🧪', color: 'bg-purple-100 text-purple-800' },
  { value: 'idea', label: 'Idée', icon: '💡', color: 'bg-indigo-100 text-indigo-800' }
];

export const TODO_PRIORITIES: { value: TodoPriority; label: string; icon: string; color: string }[] = [
  { value: 'low', label: 'Basse', icon: '🔽', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Moyenne', icon: '🔸', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Haute', icon: '🔶', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgente', icon: '🚨', color: 'bg-red-100 text-red-800' }
];

export const TODO_STATUSES: { value: TodoStatus; label: string; icon: string; color: string }[] = [
  { value: 'backlog', label: 'Backlog', icon: '📝', color: 'bg-gray-100 text-gray-800' },
  { value: 'in-progress', label: 'En cours', icon: '⚡', color: 'bg-blue-100 text-blue-800' },
  { value: 'testing', label: 'Test', icon: '🧪', color: 'bg-purple-100 text-purple-800' },
  { value: 'done', label: 'Terminé', icon: '✅', color: 'bg-green-100 text-green-800' }
];

export const DEFAULT_COLUMNS: TodoColumn[] = [
  {
    id: 'col-backlog',
    title: 'Backlog',
    status: 'backlog',
    color: 'bg-gray-50 border-gray-200',
    tasks: [],
    maxTasks: undefined
  },
  {
    id: 'col-progress',
    title: 'En cours',
    status: 'in-progress',
    color: 'bg-blue-50 border-blue-200',
    tasks: [],
    maxTasks: 3 // Limite WIP
  },
  {
    id: 'col-testing',
    title: 'Test',
    status: 'testing',
    color: 'bg-purple-50 border-purple-200',
    tasks: [],
    maxTasks: 5
  },
  {
    id: 'col-done',
    title: 'Terminé',
    status: 'done',
    color: 'bg-green-50 border-green-200',
    tasks: [],
    maxTasks: undefined
  }
];
