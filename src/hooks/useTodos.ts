/**
 * Hook pour la gestion des tâches TODO
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import secureStorage from '../utils/secureStorage';
import { sampleTasks, sampleProjects } from '../data/sampleData';
import type { 
  TodoTask, 
  TodoProject, 
  TodoFilter, 
  TodoStats,
  TodoFormData,
  TodoDragDropResult,
  TodoStatus,
  TodoType,
  TodoPriority
} from '../types/todo';

const TODO_STORAGE_KEY = 'ettu-todos';
const TODO_PROJECTS_KEY = 'ettu-todo-projects';

export function useTodos() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [projects, setProjects] = useState<TodoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TodoFilter>({});

  // Initialisation des données au montage du composant
  useEffect(() => {
    const initializeData = () => {
      try {
        // Charger les tâches
        const tasksData = secureStorage.getItem(TODO_STORAGE_KEY);
        if (tasksData) {
          try {
            const parsedTasks = JSON.parse(tasksData);
            setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
          } catch (error) {
            console.error('Erreur parsing tasks:', error);
            setTasks([]);
          }
        } else {
          // Charger les données de test si aucune donnée n'existe
          setTasks(sampleTasks);
          secureStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(sampleTasks));
        }

        // Charger les projets
        const projectsData = secureStorage.getItem(TODO_PROJECTS_KEY);
        if (projectsData) {
          try {
            const parsedProjects = JSON.parse(projectsData);
            setProjects(Array.isArray(parsedProjects) ? parsedProjects : []);
          } catch (error) {
            console.error('Erreur parsing projects:', error);
            setProjects([]);
          }
        } else {
          // Charger les projets de test si aucune donnée n'existe
          setProjects(sampleProjects);
          secureStorage.setItem(TODO_PROJECTS_KEY, JSON.stringify(sampleProjects));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données TODO:', error);
        setTasks([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []); // Pas de dépendances pour éviter les boucles infinies

  // Sauvegarder les tâches
  const saveTasks = useCallback((newTasks: TodoTask[]) => {
    try {
      setTasks(newTasks);
      secureStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(newTasks));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches:', error);
    }
  }, []);

  // Sauvegarder les projets
  const saveProjects = useCallback((newProjects: TodoProject[]) => {
    try {
      setProjects(newProjects);
      secureStorage.setItem(TODO_PROJECTS_KEY, JSON.stringify(newProjects));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des projets:', error);
    }
  }, []);

  // Créer une nouvelle tâche
  const createTask = (taskData: TodoFormData): TodoTask => {
    const newTask: TodoTask = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      priority: taskData.priority,
      status: taskData.status,
      tags: taskData.tags,
      project: taskData.project,
      assignee: taskData.assignee,
      estimatedTime: taskData.estimatedTime,
      actualTime: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: taskData.dueDate,
      completedAt: undefined,
      relatedNotes: taskData.relatedNotes || [],
      relatedSnippets: taskData.relatedSnippets || [],
      checklist: [],
      comments: []
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return newTask;
  };

  // Mettre à jour une tâche
  const updateTask = (taskId: string, updates: Partial<TodoTask>) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            ...updates, 
            updatedAt: new Date(),
            completedAt: updates.status === 'done' ? new Date() : task.completedAt
          }
        : task
    );
    saveTasks(updatedTasks);
  };

  // Supprimer une tâche
  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  // Déplacer une tâche (drag & drop)
  const moveTask = (result: TodoDragDropResult) => {
    const { taskId, targetStatus } = result;
    updateTask(taskId, { status: targetStatus });
  };

  // Créer un projet
  const createProject = (name: string, description?: string, color: string = '#3B82F6') => {
    const newProject: TodoProject = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      color,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    return newProject;
  };

  // Supprimer un projet
  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
    
    // Mettre à jour les tâches qui utilisent ce projet
    const updatedTasks = tasks.map(task => 
      task.project === projectId 
        ? { ...task, project: undefined, updatedAt: new Date() }
        : task
    );
    saveTasks(updatedTasks);
  };

  // Filtrer les tâches
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (filter.type && filter.type.length > 0) {
      filtered = filtered.filter(task => filter.type!.includes(task.type));
    }

    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter(task => filter.priority!.includes(task.priority));
    }

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(task => filter.status!.includes(task.status));
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(task => 
        filter.tags!.some(tag => task.tags.includes(tag))
      );
    }

    if (filter.project) {
      filtered = filtered.filter(task => task.project === filter.project);
    }

    if (filter.assignee) {
      filtered = filtered.filter(task => task.assignee === filter.assignee);
    }

    if (filter.dateRange) {
      filtered = filtered.filter(task => {
        const createdAt = new Date(task.createdAt);
        return createdAt >= filter.dateRange!.start && createdAt <= filter.dateRange!.end;
      });
    }

    return filtered;
  }, [tasks, filter]);

  // Grouper les tâches par statut
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TodoStatus, TodoTask[]> = {
      backlog: [],
      'in-progress': [],
      testing: [],
      done: []
    };

    filteredTasks.forEach(task => {
      grouped[task.status].push(task);
    });

    // Trier chaque groupe par ordre, puis par date de création
    Object.keys(grouped).forEach(status => {
      grouped[status as TodoStatus].sort((a, b) => {
        // Si les deux ont un ordre, trier par ordre
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        // Si seulement a a un ordre, a vient en premier
        if (a.order !== undefined) return -1;
        // Si seulement b a un ordre, b vient en premier
        if (b.order !== undefined) return 1;
        // Sinon trier par date de création (plus récent en premier)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });

    return grouped;
  }, [filteredTasks]);

  // Calculer les statistiques
  const stats = useMemo((): TodoStats => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calcul du temps moyen de complétion
    const completedTasksWithTime = tasks.filter(t => t.status === 'done' && t.completedAt);
    const averageCompletionTime = completedTasksWithTime.length > 0
      ? completedTasksWithTime.reduce((sum, task) => {
          const duration = new Date(task.completedAt!).getTime() - new Date(task.createdAt).getTime();
          return sum + duration;
        }, 0) / completedTasksWithTime.length / (1000 * 60 * 60 * 24) // en jours
      : 0;

    // Répartition par type
    const tasksByType = tasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {} as Record<TodoType, number>);

    // Répartition par priorité
    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TodoPriority, number>);

    // Répartition par statut
    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TodoStatus, number>);

    // Temps estimé vs réel
    const estimatedTime = tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
    const actualTime = tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
      averageCompletionTime,
      tasksByType,
      tasksByPriority,
      tasksByStatus,
      estimatedVsActualTime: {
        estimated: estimatedTime,
        actual: actualTime
      }
    };
  }, [tasks]);

  // Obtenir les tags uniques
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  // Obtenir les assignés uniques
  const allAssignees = useMemo(() => {
    const assigneeSet = new Set<string>();
    tasks.forEach(task => {
      if (task.assignee) {
        assigneeSet.add(task.assignee);
      }
    });
    return Array.from(assigneeSet).sort();
  }, [tasks]);

  // Nettoyer les données
  const cleanup = useCallback(() => {
    try {
      secureStorage.removeItem(TODO_STORAGE_KEY);
      secureStorage.removeItem(TODO_PROJECTS_KEY);
      setTasks([]);
      setProjects([]);
    } catch (error) {
      console.error('Erreur lors du nettoyage des données:', error);
    }
  }, []);

  // Fonction pour réinitialiser les données avec les données de test
  const loadSampleData = useCallback(() => {
    setTasks(sampleTasks);
    setProjects(sampleProjects);
    secureStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(sampleTasks));
    secureStorage.setItem(TODO_PROJECTS_KEY, JSON.stringify(sampleProjects));
  }, []);

  // Fonction pour vider toutes les données
  const clearAllData = useCallback(() => {
    setTasks([]);
    setProjects([]);
    secureStorage.removeItem(TODO_STORAGE_KEY);
    secureStorage.removeItem(TODO_PROJECTS_KEY);
  }, []);

  return {
    // État
    tasks,
    projects,
    loading,
    filter,

    // Statistiques
    stats,

    // Données calculées
    filteredTasks,
    tasksByStatus,
    allTags,
    allAssignees,

    // Actions sur les tâches
    createTask,
    updateTask,
    deleteTask,
    moveTask,

    // Actions sur les projets
    createProject,
    deleteProject,

    // Actions sur les filtres
    setFilter,
    clearFilter: () => setFilter({}),

    // Utilitaires
    cleanup,
    loadSampleData,
    clearAllData,
    
    // Fonctions utilitaires
    getTaskById: (id: string) => tasks.find(t => t.id === id),
    getProjectById: (id: string) => projects.find(p => p.id === id),
    getTasksByProject: (projectId: string) => tasks.filter(t => t.project === projectId),
    getTasksByTag: (tag: string) => tasks.filter(t => t.tags.includes(tag)),
    getTasksByAssignee: (assignee: string) => tasks.filter(t => t.assignee === assignee)
  };
}

export default useTodos;
