/**
 * Composant pour l'intégration entre projets et todos
 * Affiche des informations contextuelles quand un filtre de projet est actif
 */

import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TodoProject } from "../types/todo";

interface ProjectTodoIntegrationProps {
  filteredProject?: TodoProject;
  onClearFilter: () => void;
}

export default function ProjectTodoIntegration({ 
  filteredProject, 
  onClearFilter 
}: ProjectTodoIntegrationProps) {
  const navigate = useNavigate();

  if (!filteredProject) {
    return null;
  }

  const handleBackToProject = () => {
    navigate('/projects');
  };

  return (
    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: filteredProject.color }}
          />
          <div>
            <p className="text-sm text-blue-300">
              <span className="font-medium">Projet filtré:</span> {filteredProject.name}
            </p>
            <p className="text-xs text-blue-400">
              Affichage des tâches pour ce projet uniquement
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBackToProject}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Retour aux projets</span>
          </button>
          <button
            onClick={onClearFilter}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Voir toutes les tâches</span>
          </button>
        </div>
      </div>
    </div>
  );
}
