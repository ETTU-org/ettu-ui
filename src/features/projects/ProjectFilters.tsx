/**
 * Composant de filtres pour les projets
 */

import { useState } from "react";
import { X, Calendar, Filter } from "lucide-react";
import type { ProjectFilter } from "../../types/project";
import { PROJECT_STATUSES, COMMON_TECHNOLOGIES } from "../../types/project";

interface ProjectFiltersProps {
  filter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  onClearFilter: () => void;
}

export default function ProjectFilters({
  filter,
  onFilterChange,
  onClearFilter,
}: ProjectFiltersProps) {
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);
  const [newTechnology, setNewTechnology] = useState("");

  const handleStatusChange = (status: string) => {
    const currentStatuses = filter.status || [];
    const newStatuses = currentStatuses.includes(status as any)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status as any];

    onFilterChange({
      ...filter,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleTechnologyChange = (tech: string) => {
    const currentTechnologies = filter.technologies || [];
    const newTechnologies = currentTechnologies.includes(tech)
      ? currentTechnologies.filter((t) => t !== tech)
      : [...currentTechnologies, tech];

    onFilterChange({
      ...filter,
      technologies: newTechnologies.length > 0 ? newTechnologies : undefined,
    });
  };

  const handleAddTechnology = () => {
    if (
      newTechnology.trim() &&
      !(filter.technologies || []).includes(newTechnology.trim())
    ) {
      handleTechnologyChange(newTechnology.trim());
      setNewTechnology("");
      setShowTechSuggestions(false);
    }
  };

  const filteredTechSuggestions = COMMON_TECHNOLOGIES.filter(
    (tech) =>
      tech.toLowerCase().includes(newTechnology.toLowerCase()) &&
      !(filter.technologies || []).includes(tech)
  );

  const hasActiveFilters = Boolean(
    filter.status?.length ||
      filter.technologies?.length ||
      filter.dateRange ||
      filter.search
  );

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Filtres</h2>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilter}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Effacer tout
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Status Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Statut</h3>
          <div className="space-y-2">
            {PROJECT_STATUSES.map((status) => (
              <label
                key={status.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    filter.status?.includes(status.value as any) || false
                  }
                  onChange={() => handleStatusChange(status.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                >
                  <span className="mr-1">{status.icon}</span>
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Technologies Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Technologies
          </h3>

          {/* Add Technology */}
          <div className="relative mb-3">
            <input
              type="text"
              value={newTechnology}
              onChange={(e) => {
                setNewTechnology(e.target.value);
                setShowTechSuggestions(true);
              }}
              onFocus={() => setShowTechSuggestions(true)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTechnology())
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ajouter une technologie"
            />

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

          {/* Selected Technologies */}
          {filter.technologies && filter.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filter.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleTechnologyChange(tech)}
                    className="ml-1 text-blue-400 hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Période de création
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Du</label>
              <input
                type="date"
                value={
                  filter.dateRange?.start.toISOString().split("T")[0] || ""
                }
                onChange={(e) => {
                  const start = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  onFilterChange({
                    ...filter,
                    dateRange:
                      start && filter.dateRange?.end
                        ? {
                            start,
                            end: filter.dateRange.end,
                          }
                        : undefined,
                  });
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Au</label>
              <input
                type="date"
                value={filter.dateRange?.end.toISOString().split("T")[0] || ""}
                onChange={(e) => {
                  const end = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  onFilterChange({
                    ...filter,
                    dateRange:
                      end && filter.dateRange?.start
                        ? {
                            start: filter.dateRange.start,
                            end,
                          }
                        : undefined,
                  });
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filter.dateRange && (
            <button
              onClick={() =>
                onFilterChange({ ...filter, dateRange: undefined })
              }
              className="mt-2 text-sm text-red-400 hover:text-red-300"
            >
              Effacer les dates
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Filtres actifs :</div>
          <div className="flex flex-wrap gap-1">
            {filter.status?.map((status) => {
              const statusConfig = PROJECT_STATUSES.find(
                (s) => s.value === status
              );
              return statusConfig ? (
                <span
                  key={status}
                  className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                >
                  {statusConfig.icon} {statusConfig.label}
                </span>
              ) : null;
            })}
            {filter.technologies?.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
            {filter.dateRange && (
              <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                <Calendar className="w-3 h-3 inline mr-1" />
                Période définie
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
