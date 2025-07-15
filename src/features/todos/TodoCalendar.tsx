/**
 * Composant vue calendrier pour les tâches TODO
 */

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, User, AlertCircle, X, Calendar } from "lucide-react";
import type { TodoTask, TodoProject } from "../../types/todo";

interface TodoCalendarProps {
  tasks: TodoTask[];
  onEditTask: (task: TodoTask) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<TodoTask>) => void;
  projects: TodoProject[];
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: TodoTask[];
}

type CalendarView = 'month' | 'week' | 'day';

export default function TodoCalendar({ tasks, onEditTask, projects }: TodoCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [viewMode, setViewMode] = useState<CalendarView>('month');

  // Générer les jours du calendrier selon le mode de vue
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    
    let startDate: Date;
    let endDate: Date;
    
    if (viewMode === 'month') {
      // Vue mensuelle - logique existante
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    } else if (viewMode === 'week') {
      // Vue hebdomadaire - semaine courante
      const currentDay = new Date(year, month, date);
      const dayOfWeek = currentDay.getDay();
      
      startDate = new Date(currentDay);
      startDate.setDate(startDate.getDate() - dayOfWeek);
      
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    } else {
      // Vue journalière - jour courant seulement
      startDate = new Date(year, month, date);
      endDate = new Date(year, month, date);
    }
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    const today = new Date();
    
    // Grouper les tâches par date d'échéance
    const tasksByDate = tasks.reduce((acc, task) => {
      if (task.dueDate) {
        const dateKey = new Date(task.dueDate).toDateString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(task);
      }
      return acc;
    }, {} as Record<string, TodoTask[]>);
    
    while (current <= endDate) {
      const dayTasks = tasksByDate[current.toDateString()] || [];
      
      days.push({
        date: new Date(current),
        isCurrentMonth: viewMode === 'month' ? current.getMonth() === month : true,
        isToday: current.toDateString() === today.toDateString(),
        tasks: dayTasks
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate, tasks, viewMode]);

  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
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
      case 'backlog': return 'border-gray-500 text-gray-300';
      case 'in-progress': return 'border-blue-500 text-blue-300';
      case 'testing': return 'border-purple-500 text-purple-300';
      case 'done': return 'border-green-500 text-green-300';
      default: return 'border-gray-500 text-gray-300';
    }
  };

  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
  };

  const closeDayModal = () => {
    setSelectedDay(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getViewTitle = () => {
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getFullYear()}`;
      } else {
        return `${startOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${monthNames[endOfWeek.getMonth()]} ${startOfWeek.getFullYear()}`;
      }
    } else {
      return currentDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const getTaskSummary = (tasks: TodoTask[]) => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;

    return { statusCounts, priorityCounts, overdueTasks };
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white">
            {getViewTitle()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Aujourd'hui
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Boutons de mode de vue */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Jour
            </button>
          </div>
          
          {/* Boutons de navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-gray-700 rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 hover:bg-gray-700 rounded-md transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4">
        {/* Day headers - seulement pour vue mois et semaine */}
        {viewMode !== 'day' && (
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Calendar days */}
        <div className={`gap-1 h-full ${
          viewMode === 'month' 
            ? 'grid grid-cols-7' 
            : viewMode === 'week' 
              ? 'grid grid-cols-7' 
              : 'flex flex-col'
        }`}>
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`border border-gray-700 rounded-lg p-2 flex flex-col cursor-pointer hover:bg-gray-750 transition-colors ${
                day.isCurrentMonth ? 'bg-gray-800' : 'bg-gray-850'
              } ${day.isToday ? 'ring-2 ring-blue-500' : ''} ${
                viewMode === 'day' 
                  ? 'min-h-[200px] mb-2' 
                  : 'min-h-[120px] max-h-[120px]'
              }`}
            >
              {/* Date */}
              <div className={`font-medium mb-1 flex-shrink-0 ${
                day.isCurrentMonth ? 'text-white' : 'text-gray-500'
              } ${day.isToday ? 'text-blue-400' : ''} ${
                viewMode === 'day' ? 'text-xl mb-2' : 'text-sm'
              }`}>
                {viewMode === 'day' 
                  ? day.date.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })
                  : day.date.getDate()
                }
              </div>

              {/* Tasks */}
              <div className={`space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 ${
                viewMode === 'day' ? 'space-y-2' : ''
              }`}>
                {day.tasks.map((task) => {
                  const project = getProjectById(task.project || '');
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-1 rounded cursor-pointer hover:shadow-sm transition-shadow border-l-2 ${
                        getTaskStatusColor(task.status)
                      } ${isOverdue ? 'bg-red-900' : 'bg-gray-700'} ${
                        viewMode === 'day' ? 'p-3 border-l-4' : 'text-xs'
                      }`}
                      title={`${task.title} - ${task.description || ''}`}
                    >
                      <div className="flex items-center space-x-1">
                        <div className={`rounded-full flex-shrink-0 ${getTaskPriorityColor(task.priority)} ${
                          viewMode === 'day' ? 'w-3 h-3' : 'w-2 h-2'
                        }`} />
                        <span className={`truncate font-medium text-white ${
                          viewMode === 'day' ? 'text-sm' : ''
                        }`}>
                          {task.title}
                        </span>
                        {isOverdue && <AlertCircle className={`text-red-400 flex-shrink-0 ${
                          viewMode === 'day' ? 'w-4 h-4' : 'w-3 h-3'
                        }`} />}
                      </div>
                      
                      {viewMode === 'day' && task.description && (
                        <p className="text-xs text-gray-300 mt-1 mb-2">{task.description}</p>
                      )}
                      
                      <div className={`flex items-center justify-between ${
                        viewMode === 'day' ? 'mt-2' : 'mt-1'
                      }`}>
                        <div className="flex items-center space-x-1">
                          {task.assignee && (
                            <div className="flex items-center space-x-1">
                              <User className={`text-gray-400 ${
                                viewMode === 'day' ? 'w-4 h-4' : 'w-3 h-3'
                              }`} />
                              <span className={`text-gray-300 truncate ${
                                viewMode === 'day' ? 'text-sm max-w-none' : 'max-w-[60px]'
                              }`}>
                                {viewMode === 'day' ? task.assignee : task.assignee.split(' ')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {task.estimatedTime && (
                            <>
                              <Clock className={`text-gray-400 ${
                                viewMode === 'day' ? 'w-4 h-4' : 'w-3 h-3'
                              }`} />
                              <span className={`text-gray-300 ${
                                viewMode === 'day' ? 'text-sm' : ''
                              }`}>
                                {task.estimatedTime}h
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {project && (
                        <div className={`${viewMode === 'day' ? 'mt-2' : 'mt-1'}`}>
                          <span 
                            className={`px-1 py-0.5 rounded ${
                              viewMode === 'day' ? 'text-sm px-2 py-1' : 'text-xs'
                            }`}
                            style={{ backgroundColor: `${project.color}20`, color: project.color }}
                          >
                            {project.name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal pour les détails du jour */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header de la modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                  {formatDate(selectedDay.date)}
                </h3>
              </div>
              <button
                onClick={closeDayModal}
                className="p-2 hover:bg-gray-700 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-4">
              {selectedDay.tasks.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p>Aucune tâche pour ce jour</p>
                </div>
              ) : (
                <>
                  {/* Résumé des tâches */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Résumé du jour</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Total des tâches</div>
                        <div className="text-2xl font-bold text-white">{selectedDay.tasks.length}</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Tâches en retard</div>
                        <div className="text-2xl font-bold text-red-400">
                          {getTaskSummary(selectedDay.tasks).overdueTasks}
                        </div>
                      </div>
                    </div>

                    {/* Répartition par statut */}
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-2">Par statut</div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(getTaskSummary(selectedDay.tasks).statusCounts).map(([status, count]) => (
                          <div key={status} className={`px-2 py-1 rounded text-xs ${getTaskStatusColor(status)}`}>
                            {status === 'backlog' && 'Backlog'}
                            {status === 'in-progress' && 'En cours'}
                            {status === 'testing' && 'Test'}
                            {status === 'done' && 'Terminé'}
                            : {count}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Répartition par priorité */}
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-2">Par priorité</div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(getTaskSummary(selectedDay.tasks).priorityCounts).map(([priority, count]) => (
                          <div key={priority} className="flex items-center space-x-1 px-2 py-1 bg-gray-700 rounded text-xs">
                            <div className={`w-2 h-2 rounded-full ${getTaskPriorityColor(priority)}`} />
                            <span className="text-white">
                              {priority === 'urgent' && 'Urgent'}
                              {priority === 'high' && 'Haute'}
                              {priority === 'medium' && 'Moyenne'}
                              {priority === 'low' && 'Basse'}
                              : {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Liste des tâches */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Tâches du jour</h4>
                    <div className="space-y-2">
                      {selectedDay.tasks.map((task) => {
                        const project = getProjectById(task.project || '');
                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
                        
                        return (
                          <div
                            key={task.id}
                            onClick={() => onEditTask(task)}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-l-4 ${
                              getTaskStatusColor(task.status).split(' ')[0]
                            } ${isOverdue ? 'bg-red-900' : 'bg-gray-750'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className={`w-3 h-3 rounded-full ${getTaskPriorityColor(task.priority)}`} />
                                  <h5 className="font-medium text-white">{task.title}</h5>
                                  {isOverdue && <AlertCircle className="w-4 h-4 text-red-400" />}
                                </div>
                                
                                {task.description && (
                                  <p className="text-sm text-gray-300 mb-2">{task.description}</p>
                                )}
                                
                                <div className="flex items-center space-x-4 text-xs text-gray-400">
                                  {task.assignee && (
                                    <div className="flex items-center space-x-1">
                                      <User className="w-3 h-3" />
                                      <span>{task.assignee}</span>
                                    </div>
                                  )}
                                  
                                  {task.estimatedTime && (
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{task.estimatedTime}h</span>
                                    </div>
                                  )}
                                  
                                  {project && (
                                    <span 
                                      className="px-2 py-1 rounded"
                                      style={{ backgroundColor: `${project.color}20`, color: project.color }}
                                    >
                                      {project.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
