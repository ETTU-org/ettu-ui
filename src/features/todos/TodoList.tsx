/**
 * Composant de vue en liste pour les tâches TODO
 */

import { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  User,
  Tag,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { TODO_TYPES, TODO_PRIORITIES } from "../../types/todo";
import type { TodoTask, TodoProject } from "../../types/todo";

interface TodoListProps {
  tasks: TodoTask[];
  onEditTask: (task: TodoTask) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<TodoTask>) => void;
  projects: TodoProject[];
}

export default function TodoList({
  tasks,
  onEditTask,
  onUpdateTask,
  projects,
}: TodoListProps) {
  const [sortBy, setSortBy] = useState<
    "priority" | "dueDate" | "createdAt" | "status"
  >("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getTypeConfig = (type: string) => {
    return TODO_TYPES.find((t) => t.value === type) || TODO_TYPES[0];
  };

  const getPriorityConfig = (priority: string) => {
    return (
      TODO_PRIORITIES.find((p) => p.value === priority) || TODO_PRIORITIES[0]
    );
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null;
    const project = projects.find((p) => p.id === projectId);
    return project?.name || null;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
      case "priority": {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      }
      case "dueDate":
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "status": {
        const statusOrder = {
          backlog: 1,
          "in-progress": 2,
          testing: 3,
          done: 4,
        };
        aValue = statusOrder[a.status];
        bValue = statusOrder[b.status];
        break;
      }
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  const handleToggleComplete = (task: TodoTask) => {
    const newStatus = task.status === "done" ? "backlog" : "done";
    onUpdateTask(task.id, { status: newStatus });
  };

  const TaskRow = ({ task }: { task: TodoTask }) => {
    const typeConfig = getTypeConfig(task.type);
    const priorityConfig = getPriorityConfig(task.priority);
    const projectName = getProjectName(task.project);
    const isDone = task.status === "done";
    const isOverdue =
      task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

    return (
      <div
        className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
          isDone ? "opacity-75" : ""
        }`}
      >
        <div className="flex items-start space-x-3">
          <button
            onClick={() => handleToggleComplete(task)}
            className={`mt-1 ${
              isDone ? "text-green-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {isDone ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3
                className={`font-medium ${
                  isDone ? "line-through text-gray-500" : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              <button
                onClick={() => onEditTask(task)}
                className="text-gray-400 hover:text-gray-600 p-1 -m-1"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {task.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}
              >
                <span className="mr-1">{typeConfig.icon}</span>
                {typeConfig.label}
              </span>

              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}
              >
                <span className="mr-1">{priorityConfig.icon}</span>
                {priorityConfig.label}
              </span>

              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === "done"
                    ? "bg-green-100 text-green-800"
                    : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : task.status === "testing"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {task.status === "done"
                  ? "✅"
                  : task.status === "in-progress"
                  ? "⚡"
                  : task.status === "testing"
                  ? "🧪"
                  : "📝"}
                {task.status === "done"
                  ? "Terminé"
                  : task.status === "in-progress"
                  ? "En cours"
                  : task.status === "testing"
                  ? "Test"
                  : "Backlog"}
              </span>

              {projectName && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  📁 {projectName}
                </span>
              )}
            </div>

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                {task.estimatedTime && (
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {task.estimatedTime}h estimé
                  </div>
                )}

                {task.assignee && (
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {task.assignee}
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Créé le {formatDate(task.createdAt)}
                </div>
              </div>

              {task.dueDate && (
                <div
                  className={`flex items-center ${
                    isOverdue ? "text-red-500 font-medium" : ""
                  }`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {isOverdue ? "Retard: " : "Échéance: "}
                  {formatDate(task.dueDate)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header avec contrôles de tri */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des tâches ({tasks.length})
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Trier par:</label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "priority"
                  | "dueDate"
                  | "createdAt"
                  | "status"
              )
            }
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="priority">Priorité</option>
            <option value="dueDate">Échéance</option>
            <option value="createdAt">Date création</option>
            <option value="status">Statut</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="flex-1 overflow-auto p-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune tâche trouvée
            </h3>
            <p className="text-gray-600">
              Créez votre première tâche pour commencer
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
