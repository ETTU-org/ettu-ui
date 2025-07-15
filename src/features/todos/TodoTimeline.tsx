/**
 * Composant vue timeline pour les tâches TODO
 */

import { useState, useMemo } from 'react';
import { Clock, Calendar, User, CheckCircle, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';
import type { TodoTask, TodoProject } from '../../types/todo';

interface TodoTimelineProps {
  tasks: TodoTask[];
  onEditTask: (task: TodoTask) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<TodoTask>) => void;
  projects: TodoProject[];
}

interface TimelineEvent {
  date: Date;
  task: TodoTask;
  type: 'created' | 'updated' | 'completed' | 'due';
  label: string;
}

export default function TodoTimeline({ tasks, onEditTask, projects }: TodoTimelineProps) {
  const [viewMode, setViewMode] = useState<'chronological' | 'deadline'>('chronological');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Générer les événements de la timeline
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    tasks.forEach(task => {
      // Événement de création
      events.push({
        date: new Date(task.createdAt),
        task,
        type: 'created',
        label: 'Créée'
      });

      // Événement de mise à jour (si différent de création)
      if (task.updatedAt && new Date(task.updatedAt).getTime() !== new Date(task.createdAt).getTime()) {
        events.push({
          date: new Date(task.updatedAt),
          task,
          type: 'updated',
          label: 'Mise à jour'
        });
      }

      // Événement de complétion
      if (task.completedAt) {
        events.push({
          date: new Date(task.completedAt),
          task,
          type: 'completed',
          label: 'Terminée'
        });
      }

      // Événement d'échéance
      if (task.dueDate) {
        events.push({
          date: new Date(task.dueDate),
          task,
          type: 'due',
          label: 'Échéance'
        });
      }
    });

    // Filtrer par projet si sélectionné
    const filteredEvents = selectedProject === 'all' 
      ? events 
      : events.filter(event => event.task.project === selectedProject);

    // Trier par date
    if (viewMode === 'chronological') {
      return filteredEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else {
      // Mode deadline : ne garder que les événements d'échéance, triés par date croissante
      return filteredEvents
        .filter(event => event.type === 'due')
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    }
  }, [tasks, viewMode, selectedProject]);

  // Grouper les événements par date
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: TimelineEvent[] } = {};
    
    timelineEvents.forEach(event => {
      const dateKey = event.date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return Object.entries(groups).map(([dateKey, events]) => ({
      date: new Date(dateKey),
      events: events.sort((a, b) => b.date.getTime() - a.date.getTime())
    }));
  }, [timelineEvents]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'updated': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'due': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <PauseCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-blue-900 border-blue-700 text-blue-300';
      case 'updated': return 'bg-orange-900 border-orange-700 text-orange-300';
      case 'completed': return 'bg-green-900 border-green-700 text-green-300';
      case 'due': return 'bg-red-900 border-red-700 text-red-300';
      default: return 'bg-gray-800 border-gray-600 text-gray-300';
    }
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'text-gray-400';
      case 'in-progress': return 'text-blue-400';
      case 'testing': return 'text-purple-400';
      case 'done': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const isOverdue = (task: TodoTask) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white">Timeline</h2>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('chronological')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'chronological'
                  ? 'bg-gray-600 text-blue-400 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Chronologique
            </button>
            <button
              onClick={() => setViewMode('deadline')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'deadline'
                  ? 'bg-gray-600 text-blue-400 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Échéances
            </button>
          </div>
        </div>

        {/* Project Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Projet:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les projets</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {groupedEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Aucun événement
              </h3>
              <p className="text-gray-400">
                {viewMode === 'deadline' 
                  ? 'Aucune tâche avec échéance trouvée'
                  : 'Aucune activité trouvée pour ce projet'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedEvents.map(({ date, events }, groupIndex) => (
              <div key={groupIndex} className="relative">
                {/* Date Header */}
                <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 pb-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-white">
                      {date.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                  </div>
                </div>

                {/* Events */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>

                  <div className="space-y-6">
                    {events.map((event, eventIndex) => {
                      const project = getProjectById(event.task.project || '');
                      const isTaskOverdue = isOverdue(event.task);
                      
                      return (
                        <div key={eventIndex} className="relative flex items-start space-x-4">
                          {/* Timeline Dot */}
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-800 border-2 border-gray-600 rounded-full flex items-center justify-center">
                            {getEventIcon(event.type)}
                          </div>

                          {/* Event Content */}
                          <div className="flex-1 min-w-0">
                            <div 
                              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                                getEventColor(event.type)
                              } ${isTaskOverdue ? 'ring-2 ring-red-500' : ''}`}
                              onClick={() => onEditTask(event.task)}
                            >
                              {/* Event Header */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">
                                    {event.label}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {event.date.toLocaleTimeString('fr-FR', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                                {isTaskOverdue && (
                                  <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">
                                    En retard
                                  </span>
                                )}
                              </div>

                              {/* Task Info */}
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${getTaskPriorityColor(event.task.priority)}`} />
                                  <h4 className="font-medium text-white">{event.task.title}</h4>
                                  <span className={`text-xs font-medium ${getTaskStatusColor(event.task.status)}`}>
                                    {event.task.status}
                                  </span>
                                </div>

                                {event.task.description && (
                                  <p className="text-sm text-gray-400 line-clamp-2">
                                    {event.task.description}
                                  </p>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    {event.task.assignee && (
                                      <div className="flex items-center space-x-1">
                                        <User className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-400">
                                          {event.task.assignee}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {event.task.estimatedTime && (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-400">
                                          {event.task.estimatedTime}h
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {project && (
                                    <span 
                                      className="text-xs px-2 py-1 rounded-full"
                                      style={{ 
                                        backgroundColor: `${project.color}20`, 
                                        color: project.color 
                                      }}
                                    >
                                      {project.name}
                                    </span>
                                  )}
                                </div>

                                {event.task.tags && event.task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {event.task.tags.slice(0, 3).map(tag => (
                                      <span 
                                        key={tag}
                                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {event.task.tags.length > 3 && (
                                      <span className="text-xs text-gray-400">
                                        +{event.task.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
