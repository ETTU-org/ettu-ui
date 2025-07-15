/**
 * Composant de statistiques pour les tâches TODO
 */

import { PieChart, BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { TODO_TYPES, TODO_PRIORITIES, TODO_STATUSES } from '../../types/todo';
import type { TodoStats, TodoTask, TodoProject } from '../../types/todo';

interface TodoStatsProps {
  stats: TodoStats;
  tasks: TodoTask[];
  projects: TodoProject[];
}

export default function TodoStats({ stats, projects }: TodoStatsProps) {
  const completionRateColor = stats.completionRate >= 80 ? 'text-green-600' : 
                              stats.completionRate >= 60 ? 'text-yellow-600' : 
                              'text-red-600';

  const formatDays = (days: number) => {
    if (days < 1) return `${Math.round(days * 24)}h`;
    return `${Math.round(days)}j`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <BarChart3 className="w-5 h-5 mr-2 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Statistiques</h2>
      </div>

      {/* Stats */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Vue d'ensemble */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-green-600">Terminées</p>
                <p className="text-2xl font-bold text-green-900">{stats.completedTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm text-yellow-600">En cours</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.inProgressTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-purple-600">Progression</p>
                <p className={`text-2xl font-bold ${completionRateColor}`}>
                  {Math.round(stats.completionRate)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progression globale</span>
            <span className={`text-sm font-medium ${completionRateColor}`}>
              {Math.round(stats.completionRate)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Répartition par type */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Par type
          </h3>
          <div className="space-y-2">
            {TODO_TYPES.map(type => {
              const count = stats.tasksByType[type.value] || 0;
              const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              
              return (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">{type.icon}</span>
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition par priorité */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Par priorité
          </h3>
          <div className="space-y-2">
            {TODO_PRIORITIES.map(priority => {
              const count = stats.tasksByPriority[priority.value] || 0;
              const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              
              return (
                <div key={priority.value} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">{priority.icon}</span>
                    <span className="text-sm text-gray-700">{priority.label}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition par statut */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Par statut
          </h3>
          <div className="space-y-2">
            {TODO_STATUSES.map(status => {
              const count = stats.tasksByStatus[status.value] || 0;
              const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              
              return (
                <div key={status.value} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">{status.icon}</span>
                    <span className="text-sm text-gray-700">{status.label}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Temps et performance */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Temps et performance
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Temps moyen</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDays(stats.averageCompletionTime)}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Projets actifs</p>
              <p className="text-lg font-semibold text-gray-900">
                {projects.length}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-2">Temps estimé vs réel</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Estimé:</span>
                <span className="text-sm font-medium">{stats.estimatedVsActualTime.estimated}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Réel:</span>
                <span className="text-sm font-medium">{stats.estimatedVsActualTime.actual}h</span>
              </div>
              {stats.estimatedVsActualTime.estimated > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Précision:</span>
                  <span className="text-sm font-medium">
                    {Math.round((stats.estimatedVsActualTime.actual / stats.estimatedVsActualTime.estimated) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
