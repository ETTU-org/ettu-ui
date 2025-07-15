/**
 * Composant de filtres pour les tâches TODO
 */

import { X, Filter } from "lucide-react";
import { useState } from "react";
import { TODO_TYPES, TODO_PRIORITIES, TODO_STATUSES } from "../../types/todo";
import type { TodoFilter, TodoProject } from "../../types/todo";

interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  onClearFilter: () => void;
  projects: TodoProject[];
  allAssignees: string[];
}

export default function TodoFilters({
  filter,
  onFilterChange,
  onClearFilter,
  projects,
  allAssignees,
}: TodoFiltersProps) {
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  const hasActiveFilters = Object.values(filter).some((value) =>
    Array.isArray(value) ? value.length > 0 : value
  );

  // Filtrer les assignés en fonction de la recherche
  const filteredAssignees = allAssignees.filter((assignee) =>
    assignee.toLowerCase().includes(assigneeSearch.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <Filter className="w-5 h-5 mr-2 text-gray-400" />
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
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Type */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Type</h3>
          <div className="space-y-2">
            {TODO_TYPES.map((type) => (
              <label key={type.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filter.type?.includes(type.value) || false}
                  onChange={(e) => {
                    const currentTypes = filter.type || [];
                    const newTypes = e.target.checked
                      ? [...currentTypes, type.value]
                      : currentTypes.filter((t) => t !== type.value);

                    onFilterChange({
                      ...filter,
                      type: newTypes.length > 0 ? newTypes : undefined,
                    });
                  }}
                  className="mr-2 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">
                  {type.icon} {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Priorité */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Priorité</h3>
          <div className="space-y-2">
            {TODO_PRIORITIES.map((priority) => (
              <label key={priority.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filter.priority?.includes(priority.value) || false}
                  onChange={(e) => {
                    const currentPriorities = filter.priority || [];
                    const newPriorities = e.target.checked
                      ? [...currentPriorities, priority.value]
                      : currentPriorities.filter((p) => p !== priority.value);

                    onFilterChange({
                      ...filter,
                      priority:
                        newPriorities.length > 0 ? newPriorities : undefined,
                    });
                  }}
                  className="mr-2 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">
                  {priority.icon} {priority.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Statut */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Statut</h3>
          <div className="space-y-2">
            {TODO_STATUSES.map((status) => (
              <label key={status.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filter.status?.includes(status.value) || false}
                  onChange={(e) => {
                    const currentStatuses = filter.status || [];
                    const newStatuses = e.target.checked
                      ? [...currentStatuses, status.value]
                      : currentStatuses.filter((s) => s !== status.value);

                    onFilterChange({
                      ...filter,
                      status: newStatuses.length > 0 ? newStatuses : undefined,
                    });
                  }}
                  className="mr-2 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">
                  {status.icon} {status.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Projet */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Projet</h3>
          <div className="space-y-2">
            {projects.map((project) => (
              <label key={project.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filter.project === project.id}
                  onChange={(e) => {
                    onFilterChange({
                      ...filter,
                      project: e.target.checked ? project.id : undefined,
                    });
                  }}
                  className="mr-2 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm text-gray-300">{project.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Assigné */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Assigné à</h3>
          <div className="relative">
            <input
              type="text"
              value={assigneeSearch}
              onChange={(e) => {
                setAssigneeSearch(e.target.value);
                setShowAssigneeDropdown(true);
              }}
              onFocus={() => setShowAssigneeDropdown(true)}
              onBlur={() =>
                setTimeout(() => setShowAssigneeDropdown(false), 200)
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rechercher une personne..."
            />

            {showAssigneeDropdown && filteredAssignees.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredAssignees.map((assignee) => (
                  <button
                    key={assignee}
                    onClick={() => {
                      setAssigneeSearch("");
                      setShowAssigneeDropdown(false);
                      onFilterChange({
                        ...filter,
                        assignee:
                          filter.assignee === assignee ? undefined : assignee,
                      });
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-600 transition-colors ${
                      filter.assignee === assignee
                        ? "bg-blue-600 text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {assignee}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filter.assignee && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white">
                {filter.assignee}
                <button
                  onClick={() => {
                    setAssigneeSearch("");
                    onFilterChange({
                      ...filter,
                      assignee: undefined,
                    });
                  }}
                  className="ml-1 text-white hover:text-gray-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Filtres actifs:
          </h4>
          <div className="flex flex-wrap gap-2">
            {filter.type?.map((type) => {
              const typeConfig = TODO_TYPES.find((t) => t.value === type);
              return (
                <span
                  key={type}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white"
                >
                  {typeConfig?.icon} {typeConfig?.label}
                  <button
                    onClick={() => {
                      const newTypes = filter.type?.filter((t) => t !== type);
                      onFilterChange({
                        ...filter,
                        type: newTypes?.length ? newTypes : undefined,
                      });
                    }}
                    className="ml-1 text-white hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {filter.priority?.map((priority) => {
              const priorityConfig = TODO_PRIORITIES.find(
                (p) => p.value === priority
              );
              return (
                <span
                  key={priority}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-600 text-white"
                >
                  {priorityConfig?.icon} {priorityConfig?.label}
                  <button
                    onClick={() => {
                      const newPriorities = filter.priority?.filter(
                        (p) => p !== priority
                      );
                      onFilterChange({
                        ...filter,
                        priority: newPriorities?.length
                          ? newPriorities
                          : undefined,
                      });
                    }}
                    className="ml-1 text-white hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {filter.status?.map((status) => {
              const statusConfig = TODO_STATUSES.find(
                (s) => s.value === status
              );
              return (
                <span
                  key={status}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-600 text-white"
                >
                  {statusConfig?.icon} {statusConfig?.label}
                  <button
                    onClick={() => {
                      const newStatuses = filter.status?.filter(
                        (s) => s !== status
                      );
                      onFilterChange({
                        ...filter,
                        status: newStatuses?.length ? newStatuses : undefined,
                      });
                    }}
                    className="ml-1 text-white hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {filter.project && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-600 text-white">
                📁 {projects.find((p) => p.id === filter.project)?.name}
                <button
                  onClick={() =>
                    onFilterChange({
                      ...filter,
                      project: undefined,
                    })
                  }
                  className="ml-1 text-white hover:text-gray-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filter.assignee && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white">
                👤 {filter.assignee}
                <button
                  onClick={() =>
                    onFilterChange({
                      ...filter,
                      assignee: undefined,
                    })
                  }
                  className="ml-1 text-white hover:text-gray-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
