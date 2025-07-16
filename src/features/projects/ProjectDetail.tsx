/**
 * Composant de détail d'un projet
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  FileText,
  Code,
  CheckSquare,
  Users,
  ExternalLink,
  MoreVertical,
  Clock,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";
import type { ProjectStructure, ProjectContentView } from "../../types/project";
import { PROJECT_STATUSES } from "../../types/project";
import { ProjectNoteEditor } from "./ProjectNoteEditor";
import { ProjectSnippetEditor } from "./ProjectSnippetEditor";
import { secureLocalStorage } from "../../utils/secureLocalStorage";
import { useTodos } from "../../hooks/useTodos";
import type { TodoTask, TodoFormData } from "../../types/todo";
import { TODO_PRIORITIES, TODO_STATUSES } from "../../types/todo";
import TodoTaskForm from "../todos/TodoTaskForm";

interface ProjectDetailProps {
  project: ProjectStructure;
  onBack: () => void;
  onEdit: (project: ProjectStructure) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectDetail({
  project,
  onBack,
  onEdit,
  onDelete,
}: ProjectDetailProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProjectContentView>("overview");
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [realNotesCount, setRealNotesCount] = useState(0);
  const [realSnippetsCount, setRealSnippetsCount] = useState(0);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null);
  
  // Utiliser le hook useTodos pour gérer les tâches
  const { tasks, createTask, updateTask, deleteTask, setFilter } = useTodos();

  const statusConfig = PROJECT_STATUSES.find((s) => s.value === project.status);

  // Filtrer les tâches pour ce projet
  const projectTasks = tasks.filter(task => task.project === project.id);

  // Fonctions pour gérer les tâches
  const handleCreateTask = (taskData: TodoFormData) => {
    createTask(taskData);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: TodoTask) => {
    setEditingTask(task);
    setShowTaskForm(true);
    setSelectedTask(null);
  };

  const handleUpdateTask = (taskData: TodoFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setShowTaskForm(false);
      setEditingTask(null);
      setSelectedTask(null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setSelectedTask(null);
  };

  const handleViewTask = (task: TodoTask) => {
    setSelectedTask(task);
    setShowTaskForm(false);
  };

  const handleCloseTaskView = () => {
    setSelectedTask(null);
    setEditingTask(null);
    setShowTaskForm(false);
  };

  // Composant pour afficher une tâche en détail
  const TaskDetailView = ({ task }: { task: TodoTask }) => {
    const statusConfig = TODO_STATUSES.find(s => s.value === task.status);
    const priorityConfig = TODO_PRIORITIES.find(p => p.value === task.priority);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Détail de la tâche</h2>
              <button
                onClick={handleCloseTaskView}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{task.title}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig?.color || 'bg-gray-500'}`}>
                    {statusConfig?.label || task.status}
                  </span>
                  <span className={`text-xs font-medium ${priorityConfig?.color || 'text-gray-500'}`}>
                    {priorityConfig?.label || task.priority}
                  </span>
                </div>
              </div>

              {task.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                  <p className="text-sm text-gray-400">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {task.estimatedTime && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Temps estimé</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimatedTime}h</span>
                    </div>
                  </div>
                )}

                {task.dueDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Date limite</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => handleEditTask(task)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => updateTask(task.id, { ...task, status: task.status === 'done' ? 'backlog' : 'done' })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    task.status === 'done' 
                      ? 'bg-gray-600 text-white hover:bg-gray-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>{task.status === 'done' ? 'Rouvrir' : 'Marquer terminé'}</span>
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour charger les compteurs depuis le localStorage
  const loadCounters = useCallback(() => {
    try {
      // Charger le nombre de notes
      const notesKey = `project-notes-${project.id}`;
      const storedNotes = secureLocalStorage.getItem(notesKey);
      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        setRealNotesCount(Array.isArray(notes) ? notes.length : 0);
      }

      // Charger le nombre de snippets
      const snippetsKey = `project-snippets-${project.id}`;
      const storedSnippets = secureLocalStorage.getItem(snippetsKey);
      if (storedSnippets) {
        const snippets = JSON.parse(storedSnippets);
        setRealSnippetsCount(Array.isArray(snippets) ? snippets.length : 0);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des compteurs:", error);
    }
  }, [project.id]);

  // Charger les compteurs au démarrage
  useEffect(() => {
    loadCounters();
  }, [loadCounters]);

  // Callbacks pour mettre à jour les compteurs en temps réel
  const handleNotesCountChange = useCallback((count: number) => {
    setRealNotesCount(count);
  }, []);

  const handleSnippetsCountChange = useCallback((count: number) => {
    setRealSnippetsCount(count);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: FileText },
    { id: "notes", label: `Notes (${realNotesCount})`, icon: FileText },
    { id: "snippets", label: `Snippets (${realSnippetsCount})`, icon: Code },
    {
      id: "tasks",
      label: `Tâches (${project.stats.totalTasks})`,
      icon: CheckSquare,
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Project Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{project.name}</h2>
              {project.description && (
                <p className="text-gray-300 mt-1">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {statusConfig && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
              >
                <span className="mr-1">{statusConfig.icon}</span>
                {statusConfig.label}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Créé le</h4>
            <p className="text-white">{formatDate(project.createdAt)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              Dernière activité
            </h4>
            <p className="text-white">
              {formatDate(project.stats.lastActivity)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {project.stats.totalNotes}
          </div>
          <div className="text-sm text-gray-400">Notes</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Code className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {project.stats.totalSnippets}
          </div>
          <div className="text-sm text-gray-400">Snippets</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <CheckSquare className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {project.stats.totalTasks}
          </div>
          <div className="text-sm text-gray-400">Tâches</div>
        </div>
      </div>

      {/* Technologies */}
      {project.metadata.technologies.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.metadata.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-900 text-blue-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team */}
      {project.metadata.team && project.metadata.team.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Équipe
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.metadata.team.map((member) => (
              <span
                key={member}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-900 text-green-300"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(project.metadata.repository || project.metadata.documentation) && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Liens</h3>
          <div className="space-y-2">
            {project.metadata.repository && (
              <a
                href={project.metadata.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Dépôt</span>
              </a>
            )}
            {project.metadata.documentation && (
              <a
                href={project.metadata.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Documentation</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderNotes = () => (
    <div className="h-full">
      <ProjectNoteEditor
        projectId={project.id}
        projectName={project.name}
        onNotesCountChange={handleNotesCountChange}
      />
    </div>
  );

  const renderSnippets = () => (
    <div className="h-full">
      <ProjectSnippetEditor
        projectId={project.id}
        projectName={project.name}
        onSnippetsCountChange={handleSnippetsCountChange}
      />
    </div>
  );

  const renderTasks = () => {
    const handleCreateNewTask = () => {
      setEditingTask(null);
      setShowTaskForm(true);
      setSelectedTask(null);
    };

    const handleViewAllTasks = () => {
      // Appliquer le filtre de projet et naviguer vers la page des todos
      setFilter({ project: project.id });
      navigate('/todos');
    };

    const getStatusColor = (status: TodoTask['status']) => {
      const statusConfig = TODO_STATUSES.find(s => s.value === status);
      return statusConfig?.color || 'bg-gray-500';
    };

    const getPriorityColor = (priority: TodoTask['priority']) => {
      const priorityConfig = TODO_PRIORITIES.find(p => p.value === priority);
      return priorityConfig?.color || 'text-gray-500';
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Tâches du projet ({projectTasks.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleViewAllTasks}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Voir toutes</span>
            </button>
            <button 
              onClick={handleCreateNewTask}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle tâche</span>
            </button>
          </div>
        </div>

        {projectTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>Aucune tâche dans ce projet</p>
            <p className="text-sm mb-4">
              Créez une nouvelle tâche ou assignez des tâches existantes à ce projet
            </p>
            <button 
              onClick={handleCreateNewTask}
              className="text-purple-400 hover:text-purple-300 text-sm underline mb-2 mr-4"
            >
              Créer une tâche
            </button>
            <button 
              onClick={handleViewAllTasks}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Gérer les tâches dans la vue TODO
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projectTasks.map(task => (
              <div key={task.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleViewTask(task)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-white hover:text-blue-300 transition-colors">{task.title}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {TODO_STATUSES.find(s => s.value === task.status)?.label}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {TODO_PRIORITIES.find(p => p.value === task.priority)?.label}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-400 mb-2 truncate">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {task.estimatedTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedTime}h</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>{task.tags.length} tag{task.tags.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewTask(task);
                      }}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 p-1"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTask(task.id, { ...task, status: task.status === 'done' ? 'backlog' : 'done' });
                      }}
                      className="text-green-400 hover:text-green-300 p-1"
                      title={task.status === 'done' ? 'Rouvrir' : 'Marquer terminé'}
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire de création/modification de tâche */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <TodoTaskForm
                task={editingTask}
                projects={[{ id: project.id, name: project.name, color: project.color, createdAt: project.createdAt, updatedAt: project.updatedAt }]}
                defaultProject={project.id}
                onSave={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={handleCloseTaskView}
                onDelete={editingTask ? () => handleDeleteTask(editingTask.id) : undefined}
              />
            </div>
          </div>
        )}

        {/* Vue détaillée de la tâche */}
        {selectedTask && <TaskDetailView task={selectedTask} />}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "tasks":
        return renderTasks();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">{project.name}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showActionsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      onEdit(project);
                      setShowActionsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(project.id);
                      setShowActionsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProjectContentView)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex-1 overflow-hidden ${
          activeTab === "notes" || activeTab === "snippets"
            ? ""
            : "overflow-y-auto p-6"
        }`}
        onClick={() => setShowActionsMenu(false)}
      >
        {activeTab === "notes" ? (
          renderNotes()
        ) : activeTab === "snippets" ? (
          renderSnippets()
        ) : (
          <div className="p-6">{renderContent()}</div>
        )}
      </div>
    </div>
  );
}
