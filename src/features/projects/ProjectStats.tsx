/**
 * Composant de statistiques des projets
 */

import { BarChart3, TrendingUp, FileText, Code, CheckSquare, FolderOpen, Calendar, Activity } from 'lucide-react';
import type { ProjectStats } from '../../types/project';
import { PROJECT_STATUSES } from '../../types/project';

interface ProjectStatsProps {
  stats: ProjectStats;
}

export default function ProjectStats({ stats }: ProjectStatsProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'snippet':
        return <Code className="w-4 h-4 text-green-400" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'note':
        return 'border-blue-500';
      case 'snippet':
        return 'border-green-500';
      case 'task':
        return 'border-purple-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
        <BarChart3 className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-white">Statistiques</h2>
      </div>

      {/* Stats Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FolderOpen className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Projets</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
            <div className="text-xs text-gray-400">
              {stats.activeProjects} actifs
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Notes</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalNotes}</div>
            <div className="text-xs text-gray-400">
              {stats.totalProjects > 0 ? Math.round(stats.totalNotes / stats.totalProjects) : 0} par projet
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Snippets</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalSnippets}</div>
            <div className="text-xs text-gray-400">
              {stats.totalProjects > 0 ? Math.round(stats.totalSnippets / stats.totalProjects) : 0} par projet
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckSquare className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-300">Tâches</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
            <div className="text-xs text-gray-400">
              {stats.totalProjects > 0 ? Math.round(stats.totalTasks / stats.totalProjects) : 0} par projet
            </div>
          </div>
        </div>

        {/* Projects by Status */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Projets par statut
          </h3>
          <div className="space-y-2">
            {PROJECT_STATUSES.map((status) => {
              const count = stats.projectsByStatus[status.value as keyof typeof stats.projectsByStatus] || 0;
              const percentage = stats.totalProjects > 0 ? (count / stats.totalProjects) * 100 : 0;
              
              return (
                <div key={status.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-300 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Activité récente
          </h3>
          
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>Aucune activité récente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 bg-gray-700 ${getActivityColor(activity.type)}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white truncate">
                        {activity.title}
                      </p>
                      <span className="text-xs text-gray-400">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.action === 'created' && 'Créé'}
                      {activity.action === 'updated' && 'Modifié'}
                      {activity.action === 'deleted' && 'Supprimé'}
                      {' dans '}
                      <span className="text-blue-400">{activity.projectName}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Metrics */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Métriques globales</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Contenu total</span>
                <span className="text-lg font-semibold text-white">
                  {stats.totalNotes + stats.totalSnippets + stats.totalTasks}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Notes, snippets et tâches combinés
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Productivité</span>
                <span className="text-lg font-semibold text-white">
                  {stats.activeProjects > 0 ? 
                    Math.round((stats.totalNotes + stats.totalSnippets) / stats.activeProjects) : 0
                  }
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Éléments par projet actif
              </div>
            </div>

            {stats.totalProjects > 0 && (
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Taux d'activité</span>
                  <span className="text-lg font-semibold text-white">
                    {Math.round((stats.activeProjects / stats.totalProjects) * 100)}%
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Projets actifs sur total
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
