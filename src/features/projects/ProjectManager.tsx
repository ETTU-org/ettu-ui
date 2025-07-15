/**
 * Composant principal de gestion des projets ETTU
 */

import { useState } from "react";
import { Plus, Grid, List, Filter, BarChart3, Search } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";
import ProjectDetail from "./ProjectDetail";
import ProjectStats from "./ProjectStats";
import ProjectFilters from "./ProjectFilters";
import type {
  ProjectStructure,
  ProjectViewMode,
  ProjectFormData,
} from "../../types/project";

export default function ProjectManager() {
  const {
    filteredProjects,
    filter,
    loading,
    stats,
    createProject,
    updateProject,
    deleteProject,
    setFilter,
    clearFilter,
  } = useProjects();

  const [viewMode, setViewMode] = useState<ProjectViewMode>("grid");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectStructure | null>(
    null
  );
  const [selectedProject, setSelectedProject] =
    useState<ProjectStructure | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleCreateProject = (projectData: ProjectFormData) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
      setEditingProject(null);
    } else {
      createProject(projectData);
    }
    setShowProjectForm(false);
  };

  const handleEditProject = (project: ProjectStructure) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
      )
    ) {
      deleteProject(projectId);
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setShowProjectForm(false);
  };

  const handleSelectProject = (project: ProjectStructure) => {
    setSelectedProject(project);
    setShowProjectForm(false);
    setShowFilters(false);
    setShowStats(false);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const viewModeButtons = [
    { mode: "grid" as const, icon: Grid, label: "Grille" },
    { mode: "list" as const, icon: List, label: "Liste" },
  ];

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des projets...</p>
          </div>
        </div>
      );
    }

    if (selectedProject) {
      return (
        <ProjectDetail
          project={selectedProject}
          onBack={handleBackToProjects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      );
    }

    return (
      <div className="h-full bg-gray-900">
        <ProjectList
          projects={filteredProjects}
          viewMode={viewMode}
          onSelectProject={handleSelectProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      </div>
    );
  };

  const renderSidebar = () => {
    if (showProjectForm) {
      return (
        <ProjectForm
          project={editingProject}
          onSave={handleCreateProject}
          onCancel={handleCancelEdit}
        />
      );
    }

    if (showFilters) {
      return (
        <ProjectFilters
          filter={filter}
          onFilterChange={setFilter}
          onClearFilter={clearFilter}
        />
      );
    }

    if (showStats) {
      return <ProjectStats stats={stats} />;
    }

    return null;
  };

  return (
    <div className="h-full flex bg-gray-900">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">
                {selectedProject ? selectedProject.name : "Projets"}
              </h1>

              {!selectedProject && (
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
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!selectedProject && (
                <>
                  <button
                    onClick={() => {
                      setShowFilters(!showFilters);
                      setShowStats(false);
                      setShowProjectForm(false);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      showFilters
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-400 hover:text-white"
                    }`}
                    title="Filtres"
                  >
                    <Filter className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setShowStats(!showStats);
                      setShowFilters(false);
                      setShowProjectForm(false);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      showStats
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-400 hover:text-white"
                    }`}
                    title="Statistiques"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setShowProjectForm(!showProjectForm);
                  setShowFilters(false);
                  setShowStats(false);
                  setEditingProject(null);
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau projet</span>
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          {!selectedProject && (
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={filter.search || ""}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-hidden">{renderMainContent()}</div>
      </div>

      {/* Sidebar */}
      {renderSidebar() && (
        <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          {renderSidebar()}
        </div>
      )}
    </div>
  );
}
