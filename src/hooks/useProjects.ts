/**
 * Hook pour la gestion des projets ETTU
 */

import { useState, useEffect, useMemo } from 'react';
import type { 
  ProjectStructure, 
  ProjectNote, 
  ProjectSnippet, 
  ProjectFilter, 
  ProjectStats,
  ProjectFormData,
  NoteFormData,
  SnippetFormData,
  ProjectStatus
} from '../types/project';

const STORAGE_KEYS = {
  projects: 'ettu-projects',
  notes: 'ettu-project-notes',
  snippets: 'ettu-project-snippets'
};

export function useProjects() {
  // État principal
  const [projects, setProjects] = useState<ProjectStructure[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [snippets, setSnippets] = useState<ProjectSnippet[]>([]);
  const [filter, setFilter] = useState<ProjectFilter>({});
  const [loading, setLoading] = useState(true);

  // Fonctions de sauvegarde
  const saveProjects = (data: ProjectStructure[]) => {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(data));
  };

  const saveNotes = (data: ProjectNote[]) => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(data));
  };

  const saveSnippets = (data: ProjectSnippet[]) => {
    localStorage.setItem(STORAGE_KEYS.snippets, JSON.stringify(data));
  };

  // Chargement initial
  useEffect(() => {
    const loadData = () => {
      try {
        // Charger les projets
        const savedProjects = localStorage.getItem(STORAGE_KEYS.projects);
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects);
          setProjects(parsedProjects.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            stats: {
              ...p.stats,
              lastActivity: new Date(p.stats.lastActivity)
            }
          })));
        }

        // Charger les notes
        const savedNotes = localStorage.getItem(STORAGE_KEYS.notes);
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes);
          setNotes(parsedNotes.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
            updatedAt: new Date(n.updatedAt)
          })));
        }

        // Charger les snippets
        const savedSnippets = localStorage.getItem(STORAGE_KEYS.snippets);
        if (savedSnippets) {
          const parsedSnippets = JSON.parse(savedSnippets);
          setSnippets(parsedSnippets.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt)
          })));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Gestion des projets
  const createProject = (projectData: ProjectFormData) => {
    const newProject: ProjectStructure = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: projectData.name,
      description: projectData.description,
      color: projectData.color,
      status: projectData.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalNotes: 0,
        totalSnippets: 0,
        totalTasks: 0,
        completedTasks: 0,
        lastActivity: new Date()
      },
      settings: {
        allowPublicSharing: false,
        defaultNoteType: 'documentation',
        defaultSnippetLanguage: 'typescript'
      },
      metadata: {
        technologies: projectData.technologies,
        team: projectData.team,
        repository: projectData.repository,
        documentation: projectData.documentation
      }
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    return newProject;
  };

  const updateProject = (projectId: string, updates: Partial<ProjectFormData>) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            ...updates,
            updatedAt: new Date(),
            stats: {
              ...project.stats,
              lastActivity: new Date()
            }
          }
        : project
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    
    // Supprimer les notes et snippets associés
    const updatedNotes = notes.filter(n => n.projectId !== projectId);
    const updatedSnippets = snippets.filter(s => s.projectId !== projectId);
    setNotes(updatedNotes);
    setSnippets(updatedSnippets);
    saveNotes(updatedNotes);
    saveSnippets(updatedSnippets);
  };

  // Gestion des notes
  const createNote = (projectId: string, noteData: NoteFormData) => {
    const newNote: ProjectNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: noteData.title,
      content: noteData.content,
      type: noteData.type,
      tags: noteData.tags,
      folder: noteData.folder,
      isPinned: noteData.isPinned || false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    // Mettre à jour les stats du projet
    updateProjectStats(projectId);
    
    return newNote;
  };

  const updateNote = (noteId: string, updates: Partial<NoteFormData>) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    // Mettre à jour les stats du projet
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateProjectStats(note.projectId);
    }
  };

  const deleteNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    // Mettre à jour les stats du projet
    if (note) {
      updateProjectStats(note.projectId);
    }
  };

  // Gestion des snippets
  const createSnippet = (projectId: string, snippetData: SnippetFormData) => {
    const newSnippet: ProjectSnippet = {
      id: `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: snippetData.title,
      description: snippetData.description,
      code: snippetData.code,
      language: snippetData.language,
      type: snippetData.type,
      tags: snippetData.tags,
      folder: snippetData.folder,
      isPinned: snippetData.isPinned || false,
      isArchived: false,
      dependencies: snippetData.dependencies || [],
      usage: snippetData.usage,
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId
    };

    const updatedSnippets = [...snippets, newSnippet];
    setSnippets(updatedSnippets);
    saveSnippets(updatedSnippets);

    // Mettre à jour les stats du projet
    updateProjectStats(projectId);
    
    return newSnippet;
  };

  const updateSnippet = (snippetId: string, updates: Partial<SnippetFormData>) => {
    const updatedSnippets = snippets.map(snippet => 
      snippet.id === snippetId 
        ? { ...snippet, ...updates, updatedAt: new Date() }
        : snippet
    );
    setSnippets(updatedSnippets);
    saveSnippets(updatedSnippets);

    // Mettre à jour les stats du projet
    const snippet = snippets.find(s => s.id === snippetId);
    if (snippet) {
      updateProjectStats(snippet.projectId);
    }
  };

  const deleteSnippet = (snippetId: string) => {
    const snippet = snippets.find(s => s.id === snippetId);
    const updatedSnippets = snippets.filter(s => s.id !== snippetId);
    setSnippets(updatedSnippets);
    saveSnippets(updatedSnippets);

    // Mettre à jour les stats du projet
    if (snippet) {
      updateProjectStats(snippet.projectId);
    }
  };

  // Mise à jour des statistiques du projet
  const updateProjectStats = (projectId: string) => {
    const projectNotes = notes.filter(n => n.projectId === projectId);
    const projectSnippets = snippets.filter(s => s.projectId === projectId);
    
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          stats: {
            ...project.stats,
            totalNotes: projectNotes.length,
            totalSnippets: projectSnippets.length,
            lastActivity: new Date()
          },
          updatedAt: new Date()
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  // Filtrage des projets
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(project => filter.status!.includes(project.status));
    }

    if (filter.technologies && filter.technologies.length > 0) {
      filtered = filtered.filter(project => 
        filter.technologies!.some(tech => 
          project.metadata.technologies.includes(tech)
        )
      );
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm) ||
        project.description?.toLowerCase().includes(searchTerm) ||
        project.metadata.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm)
        )
      );
    }

    if (filter.dateRange) {
      filtered = filtered.filter(project => {
        const createdAt = new Date(project.createdAt);
        return createdAt >= filter.dateRange!.start && createdAt <= filter.dateRange!.end;
      });
    }

    return filtered;
  }, [projects, filter]);

  // Statistiques globales
  const stats = useMemo((): ProjectStats => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalNotes = notes.length;
    const totalSnippets = snippets.length;
    const totalTasks = projects.reduce((sum, p) => sum + p.stats.totalTasks, 0);

    const projectsByStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<ProjectStatus, number>);

    // Activité récente
    const recentActivity: ProjectStats['recentActivity'] = [];
    
    // Ajouter les notes récentes
    notes.slice(-10).forEach(note => {
      const project = projects.find(p => p.id === note.projectId);
      if (project) {
        recentActivity.push({
          type: 'note',
          action: 'created',
          title: note.title,
          projectName: project.name,
          date: note.createdAt
        });
      }
    });

    // Ajouter les snippets récents
    snippets.slice(-10).forEach(snippet => {
      const project = projects.find(p => p.id === snippet.projectId);
      if (project) {
        recentActivity.push({
          type: 'snippet',
          action: 'created',
          title: snippet.title,
          projectName: project.name,
          date: snippet.createdAt
        });
      }
    });

    // Trier par date décroissante
    recentActivity.sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      totalProjects,
      activeProjects,
      totalNotes,
      totalSnippets,
      totalTasks,
      projectsByStatus,
      recentActivity: recentActivity.slice(0, 10)
    };
  }, [projects, notes, snippets]);

  // Fonctions utilitaires
  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const getProjectNotes = (projectId: string) => {
    return notes.filter(n => n.projectId === projectId);
  };

  const getProjectSnippets = (projectId: string) => {
    return snippets.filter(s => s.projectId === projectId);
  };

  const clearFilter = () => {
    setFilter({});
  };

  return {
    // État
    projects,
    notes,
    snippets,
    filteredProjects,
    filter,
    loading,
    stats,
    
    // Actions sur les projets
    createProject,
    updateProject,
    deleteProject,
    
    // Actions sur les notes
    createNote,
    updateNote,
    deleteNote,
    
    // Actions sur les snippets
    createSnippet,
    updateSnippet,
    deleteSnippet,
    
    // Filtres
    setFilter,
    clearFilter,
    
    // Utilitaires
    getProjectById,
    getProjectNotes,
    getProjectSnippets
  };
}
