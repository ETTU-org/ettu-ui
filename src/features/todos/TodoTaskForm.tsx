/**
 * Composant formulaire pour créer/éditer une tâche TODO
 */

import { useState, useEffect } from "react";
import {
  X,
  Save,
  Plus,
  Calendar,
  Clock,
  User,
  Tag,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { TODO_TYPES, TODO_PRIORITIES, TODO_STATUSES } from "../../types/todo";
import type { TodoTask, TodoProject, TodoFormData } from "../../types/todo";

interface TodoTaskFormProps {
  task?: TodoTask | null;
  projects: TodoProject[];
  onSave: (taskData: TodoFormData) => void;
  onCancel: () => void;
  onDelete?: (taskId: string) => void;
}

export default function TodoTaskForm({
  task,
  projects,
  onSave,
  onCancel,
  onDelete,
}: TodoTaskFormProps) {
  const [formData, setFormData] = useState<TodoFormData>({
    title: "",
    description: "",
    type: "feature",
    priority: "medium",
    status: "backlog",
    tags: [],
    project: "",
    assignee: "",
    estimatedTime: undefined,
    dueDate: undefined,
    relatedNotes: [],
    relatedSnippets: [],
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        type: task.type,
        priority: task.priority,
        status: task.status,
        tags: task.tags,
        project: task.project || "",
        assignee: task.assignee || "",
        estimatedTime: task.estimatedTime,
        dueDate: task.dueDate,
        relatedNotes: task.relatedNotes || [],
        relatedSnippets: task.relatedSnippets || [],
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const handleDelete = () => {
    if (
      task &&
      onDelete &&
      window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")
    ) {
      onDelete(task.id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          {task ? "Modifier la tâche" : "Nouvelle tâche"}
        </h2>
        <div className="flex items-center space-x-2">
          {task && onDelete && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 p-1"
              title="Supprimer la tâche"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-auto p-4 space-y-4 bg-white"
      >
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Titre de la tâche"
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
            rows={3}
            placeholder="Description détaillée de la tâche"
          />
        </div>

        {/* Type et Priorité */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as TodoTask["type"],
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              {TODO_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: e.target.value as TodoTask["priority"],
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              {TODO_PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.icon} {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as TodoTask["status"],
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            {TODO_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.icon} {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Projet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FolderOpen className="w-4 h-4 inline mr-1" />
            Projet
          </label>
          <select
            value={formData.project}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, project: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            <option value="">Aucun projet</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assigné et Temps estimé */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Assigné à
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, assignee: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Nom de la personne"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Temps estimé (heures)
            </label>
            <input
              type="number"
              value={formData.estimatedTime || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  estimatedTime: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        {/* Date d'échéance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date d'échéance
          </label>
          <input
            type="date"
            value={formatDateForInput(formData.dueDate)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                dueDate: e.target.value ? new Date(e.target.value) : undefined,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="w-4 h-4 inline mr-1" />
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Nouveau tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {task ? "Mettre à jour" : "Créer"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
