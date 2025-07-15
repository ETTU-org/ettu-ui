/**
 * Composant de liste des projets
 */

import { useState } from 'react';
import {
  FolderOpen,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  FileText,
  Code,
  CheckSquare,
  Users,
  ExternalLink
} from 'lucide-react';
import type { ProjectStructure, ProjectViewMode } from '../../types/project';
import { PROJECT_STATUSES } from '../../types/project';

interface ProjectListProps {
  projects: ProjectStructure[];
  viewMode: ProjectViewMode;
  onSelectProject: (project: ProjectStructure) => void;
  onEditProject: (project: ProjectStructure) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function ProjectList({
  projects,
  viewMode,
  onSelectProject,
  onEditProject,
  onDeleteProject
}: ProjectListProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getStatusConfig = (status: string) => {
    return PROJECT_STATUSES.find(s => s.value === status) || PROJECT_STATUSES[0];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const ProjectCard = ({ project }: { project: ProjectStructure }) => {
    const statusConfig = getStatusConfig(project.status);
    const isDropdownOpen = activeDropdown === project.id;

    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div 
            className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0"
            onClick={() => onSelectProject(project)}
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white truncate">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-gray-400 truncate mt-1">{project.description}</p>
              )}
            </div>
          </div>
          
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(isDropdownOpen ? null : project.id);
              }}
              className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                    setActiveDropdown(null);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                {project.metadata.repository && (
                  <a
                    href={project.metadata.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 flex items-center space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Dépôt</span>
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                    setActiveDropdown(null);
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

        {/* Status */}
        <div className="flex items-center space-x-2 mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
            <span className="mr-1">{statusConfig.icon}</span>
            {statusConfig.label}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(project.updatedAt)}
          </span>
        </div>

        {/* Technologies */}
        {project.metadata.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.metadata.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300"
              >
                {tech}
              </span>
            ))}
            {project.metadata.technologies.length > 3 && (
              <span className="text-xs text-gray-400">
                +{project.metadata.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>{project.stats.totalNotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code className="w-3 h-3" />
              <span>{project.stats.totalSnippets}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckSquare className="w-3 h-3" />
              <span>{project.stats.totalTasks}</span>
            </div>
          </div>
          
          {project.metadata.team && project.metadata.team.length > 0 && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{project.metadata.team.length}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ProjectListItem = ({ project }: { project: ProjectStructure }) => {
    const statusConfig = getStatusConfig(project.status);
    const isDropdownOpen = activeDropdown === project.id;

    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 transition-colors">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-4 cursor-pointer flex-1"
            onClick={() => onSelectProject(project)}
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-medium text-white">{project.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                  <span className="mr-1">{statusConfig.icon}</span>
                  {statusConfig.label}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mt-1">{project.description}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <FileText className="w-3 h-3" />
                  <span>{project.stats.totalNotes} notes</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Code className="w-3 h-3" />
                  <span>{project.stats.totalSnippets} snippets</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <CheckSquare className="w-3 h-3" />
                  <span>{project.stats.totalTasks} tâches</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(project.updatedAt)}</span>
                </div>
              </div>

              {project.metadata.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.metadata.technologies.slice(0, 5).map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.metadata.technologies.length > 5 && (
                    <span className="text-xs text-gray-400">
                      +{project.metadata.technologies.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(isDropdownOpen ? null : project.id);
              }}
              className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                    setActiveDropdown(null);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                {project.metadata.repository && (
                  <a
                    href={project.metadata.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 flex items-center space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Dépôt</span>
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                    setActiveDropdown(null);
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
    );
  };

  // Fermer le dropdown si on clique ailleurs
  const handleBackdropClick = () => {
    setActiveDropdown(null);
  };

  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-gray-400">
            Créez votre premier projet pour commencer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4" onClick={handleBackdropClick}>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
