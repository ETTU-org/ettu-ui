/**
 * Composant de gestion des projets pour les tâches TODO
 */

import { useState } from "react";
import { Plus, Edit2, Trash2, FolderOpen, X, Save } from "lucide-react";
import type { TodoProject } from "../../types/todo";

interface TodoProjectManagerProps {
  projects: TodoProject[];
}

export default function TodoProjectManager({
  projects,
}: TodoProjectManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<TodoProject | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement project creation/editing
    console.log("Project data:", formData);
    setShowForm(false);
    setEditingProject(null);
    setFormData({ name: "", description: "", color: "#3B82F6" });
  };

  const handleEdit = (project: TodoProject) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      color: project.color,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData({ name: "", description: "", color: "#3B82F6" });
  };

  const colorOptions = [
    { value: "#3B82F6", label: "Bleu", class: "bg-blue-500" },
    { value: "#10B981", label: "Vert", class: "bg-green-500" },
    { value: "#F59E0B", label: "Orange", class: "bg-yellow-500" },
    { value: "#EF4444", label: "Rouge", class: "bg-red-500" },
    { value: "#8B5CF6", label: "Violet", class: "bg-purple-500" },
    { value: "#EC4899", label: "Rose", class: "bg-pink-500" },
    { value: "#6B7280", label: "Gris", class: "bg-gray-500" },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <FolderOpen className="w-5 h-5 mr-2 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Projets</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nouveau
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du projet *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="Nom du projet"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                rows={2}
                placeholder="Description du projet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color: color.value }))
                    }
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      formData.color === color.value
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <Save className="w-4 h-4 mr-1" />
                {editingProject ? "Modifier" : "Créer"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="flex-1 overflow-auto p-4">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun projet
            </h3>
            <p className="text-gray-600 mb-4">
              Créez votre premier projet pour organiser vos tâches
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau projet
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: project.color }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement project deletion
                      console.log("Delete project:", project.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
