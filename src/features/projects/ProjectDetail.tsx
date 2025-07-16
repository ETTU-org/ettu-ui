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
} from "lucide-react";
import type { ProjectStructure, ProjectContentView } from "../../types/project";
import { PROJECT_STATUSES } from "../../types/project";
import { ProjectNoteEditor } from "./ProjectNoteEditor";
import { ProjectSnippetEditor } from "./ProjectSnippetEditor";
import { secureLocalStorage } from "../../utils/secureLocalStorage";
import { useTodos } from "../../hooks/useTodos";
import type { TodoTask } from "../../types/todo";
import { TODO_PRIORITIES, TODO_STATUSES } from "../../types/todo";

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
  
  // Utiliser le hook useTodos pour gérer les tâches
  const { tasks, createTask, updateTask, deleteTask, setFilter } = useTodos();

  const statusConfig = PROJECT_STATUSES.find((s) => s.value === project.status);

  // Filtrer les tâches pour ce projet
  const projectTasks = tasks.filter(task => task.project === project.id);

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
    const handleCreateTask = () => {
      // Créer une tâche simple avec ce projet
      const newTask = createTask({
        title: "Nouvelle tâche",
        description: "",
        type: "feature",
        status: "backlog",
        priority: "medium",
        project: project.id,
        estimatedTime: 1,
        tags: []
      });
      console.log("Tâche créée:", newTask);
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
              onClick={handleCreateTask}
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
              onClick={handleViewAllTasks}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Gérer les tâches dans la vue TODO
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projectTasks.map(task => (
              <div key={task.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {TODO_STATUSES.find(s => s.value === task.status)?.label}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {TODO_PRIORITIES.find(p => p.value === task.priority)?.label}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-400 mb-2">{task.description}</p>
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
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => updateTask(task.id, { ...task, status: task.status === 'done' ? 'backlog' : 'done' })}
                      className="text-green-400 hover:text-green-300"
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
