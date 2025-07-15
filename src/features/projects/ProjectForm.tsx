/**
 * Formulaire de création/modification de projet
 */

import { useState, useEffect } from "react";
import { X, Save, Plus } from "lucide-react";
import type { ProjectStructure, ProjectFormData } from "../../types/project";
import { PROJECT_STATUSES, COMMON_TECHNOLOGIES } from "../../types/project";

interface ProjectFormProps {
  project?: ProjectStructure | null;
  onSave: (projectData: ProjectFormData) => void;
  onCancel: () => void;
}

export default function ProjectForm({
  project,
  onSave,
  onCancel,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    color: "#3B82F6",
    status: "active",
    technologies: [],
    team: [],
    repository: "",
    documentation: "",
  });

  const [newTechnology, setNewTechnology] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || "",
        color: project.color,
        status: project.status,
        technologies: project.metadata.technologies,
        team: project.metadata.team || [],
        repository: project.metadata.repository || "",
        documentation: project.metadata.documentation || "",
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  const handleAddTechnology = () => {
    if (
      newTechnology.trim() &&
      !formData.technologies.includes(newTechnology.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }));
      setNewTechnology("");
      setShowTechSuggestions(false);
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.trim() && !formData.team.includes(newTeamMember.trim())) {
      setFormData((prev) => ({
        ...prev,
        team: [...prev.team, newTeamMember.trim()],
      }));
      setNewTeamMember("");
    }
  };

  const handleRemoveTeamMember = (member: string) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m !== member),
    }));
  };

  const filteredTechSuggestions = COMMON_TECHNOLOGIES.filter(
    (tech) =>
      tech.toLowerCase().includes(newTechnology.toLowerCase()) &&
      !formData.technologies.includes(tech)
  );

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">
          {project ? "Modifier le projet" : "Nouveau projet"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nom du projet *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mon projet"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description du projet"
            rows={3}
          />
        </div>

        {/* Couleur et Statut */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Couleur
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-10 h-10 rounded-md border border-gray-600 bg-gray-700"
              />
              <span className="text-white">{formData.color}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as ProjectStructure["status"],
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Technologies
          </label>
          <div className="space-y-2">
            <div className="relative">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => {
                    setNewTechnology(e.target.value);
                    setShowTechSuggestions(true);
                  }}
                  onFocus={() => setShowTechSuggestions(true)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ajouter une technologie"
                />
                <button
                  type="button"
                  onClick={handleAddTechnology}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showTechSuggestions && filteredTechSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md max-h-40 overflow-y-auto">
                  {filteredTechSuggestions.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => {
                        setNewTechnology(tech);
                        handleAddTechnology();
                      }}
                      className="w-full px-3 py-2 text-left text-white hover:bg-gray-600"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-1 text-blue-400 hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Équipe */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Équipe
          </label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleAddTeamMember())
                }
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du membre"
              />
              <button
                type="button"
                onClick={handleAddTeamMember}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {formData.team.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.team.map((member) => (
                  <span
                    key={member}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900 text-green-300"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(member)}
                      className="ml-1 text-green-400 hover:text-green-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Repository */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Dépôt (Repository)
          </label>
          <input
            type="url"
            value={formData.repository}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, repository: e.target.value }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/user/repo"
          />
        </div>

        {/* Documentation */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Documentation
          </label>
          <input
            type="url"
            value={formData.documentation}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                documentation: e.target.value,
              }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://docs.example.com"
          />
        </div>
      </form>

      {/* Actions */}
      <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{project ? "Modifier" : "Créer"}</span>
        </button>
      </div>
    </div>
  );
}
