/**
 * Composant principal pour la gestion des tâches TODO
 */

import { useState } from "react";
import {
  Plus,
  Filter,
  BarChart3,
  Settings,
  Grid,
  List,
  Calendar,
  Clock,
} from "lucide-react";
import { useTodos } from "../../hooks/useTodos";
import { useResponsiveView } from "../../hooks/useResponsiveView";
import { ResponsiveLayout } from "../../utils/responsive";
import TodoBoard from "./TodoBoard";
import TodoList from "./TodoList";
import TodoCalendar from "./TodoCalendar";
import TodoTimeline from "./TodoTimeline";
import TodoTaskForm from "./TodoTaskForm";
import TodoFilters from "./TodoFilters";
import TodoStats from "./TodoStats";
import TodoProjectManager from "./TodoProjectManager";
import ProjectTodoIntegration from "../../components/ProjectTodoIntegration";
import type { TodoTask, TodoViewMode, TodoFormData } from "../../types/todo";

export default function TodoManager() {
  const { isMobile } = useResponsiveView();
  const {
    tasks,
    projects,
    loading,
    filteredTasks,
    tasksByStatus,
    stats,
    createTask,
    updateTask,
    deleteTask,
    filter,
    setFilter,
    clearFilter,
    loadSampleData,
    allAssignees,
    // clearAllData,
  } = useTodos();

  const [viewMode, setViewMode] = useState<TodoViewMode["view"]>("board");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);

  const handleCreateTask = (taskData: TodoFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      createTask(taskData);
    }
    setShowTaskForm(false);
  };

  const handleEditTask = (task: TodoTask) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des tâches...</p>
          </div>
        </div>
      );
    }

    switch (viewMode) {
      case "board":
        return (
          <div className="h-full bg-gray-900">
            <TodoBoard
              tasks={filteredTasks}
              tasksByStatus={tasksByStatus}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              projects={projects}
            />
          </div>
        );
      case "list":
        return (
          <div className="h-full bg-gray-900">
            <TodoList
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              projects={projects}
            />
          </div>
        );
      case "calendar":
        return (
          <div className="h-full bg-gray-900">
            <TodoCalendar
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              projects={projects}
            />
          </div>
        );
      case "timeline":
        return (
          <div className="h-full bg-gray-900">
            <TodoTimeline
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              projects={projects}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderSidebar = () => {
    if (showTaskForm) {
      return (
        <TodoTaskForm
          task={editingTask}
          projects={projects}
          defaultProject={filter.project}
          onSave={handleCreateTask}
          onCancel={handleCancelEdit}
          onDelete={deleteTask}
        />
      );
    }

    if (showFilters) {
      return (
        <TodoFilters
          filter={filter}
          onFilterChange={setFilter}
          onClearFilter={clearFilter}
          projects={projects}
          allAssignees={allAssignees}
        />
      );
    }

    if (showStats) {
      return <TodoStats stats={stats} tasks={tasks} projects={projects} />;
    }

    if (showProjectManager) {
      return <TodoProjectManager projects={projects} />;
    }

    return (
      <div className="p-4 space-y-4 bg-gray-800">
        <div className="text-sm text-gray-400">
          <div className="font-medium mb-2 text-white">Aperçu rapide</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Total:</span>
              <span className="font-medium text-white">{stats.totalTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Terminées:</span>
              <span className="font-medium text-green-400">
                {stats.completedTasks}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">En cours:</span>
              <span className="font-medium text-blue-400">
                {stats.inProgressTasks}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Progression:</span>
              <span className="font-medium text-white">
                {Math.round(stats.completionRate)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const viewModeButtons = [
    { mode: "board" as const, icon: Grid, label: "Tableau" },
    { mode: "list" as const, icon: List, label: "Liste" },
    { mode: "calendar" as const, icon: Calendar, label: "Calendrier" },
    { mode: "timeline" as const, icon: Clock, label: "Timeline" },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">TODO Techniques</h1>
          <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            {viewModeButtons.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-gray-600 text-blue-400 shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              setShowStats(false);
              setShowProjectManager(false);
              setShowTaskForm(false);
            }}
            className={`p-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
            title="Filtres"
          >
            <Filter className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setShowStats(!showStats);
              setShowFilters(false);
              setShowProjectManager(false);
              setShowTaskForm(false);
            }}
            className={`p-2 rounded-lg transition-colors ${
              showStats
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
            title="Statistiques"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setShowProjectManager(!showProjectManager);
              setShowFilters(false);
              setShowStats(false);
              setShowTaskForm(false);
            }}
            className={`p-2 rounded-lg transition-colors ${
              showProjectManager
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
            title="Projets"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Bouton pour charger les données de test */}
          <button
            onClick={() => {
              if (
                confirm(
                  "Voulez-vous charger les données de test ? Cela remplacera vos données actuelles."
                )
              ) {
                loadSampleData();
              }
            }}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors"
            title="Charger les données de test"
          >
            <span className="text-sm">🎯</span>
          </button>

          <button
            onClick={() => {
              setShowTaskForm(!showTaskForm);
              setShowFilters(false);
              setShowStats(false);
              setShowProjectManager(false);
              setEditingTask(null);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle tâche</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {isMobile ? (
          <ResponsiveLayout
            mainContent={
              <div>
                <ProjectTodoIntegration
                  filteredProject={filter.project ? projects.find(p => p.id === filter.project) : undefined}
                  onClearFilter={clearFilter}
                />
                {renderMainContent()}
              </div>
            }
            previewContent={renderSidebar()}
            tabs={[
              { id: "main", label: "Tâches", icon: "📋" },
              { id: "preview", label: "Outils", icon: "🛠️" },
            ]}
          />
        ) : (
          <div className="flex h-full">
            <div className="flex-1 p-4 bg-gray-900">
              {/* Intégration projet-todo */}
              <ProjectTodoIntegration
                filteredProject={filter.project ? projects.find(p => p.id === filter.project) : undefined}
                onClearFilter={clearFilter}
              />
              {renderMainContent()}
            </div>
            <div className="w-80 border-l border-gray-700 bg-gray-800">
              {renderSidebar()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
