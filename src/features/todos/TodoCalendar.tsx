/**
 * Composant vue calendrier pour les tâches TODO
 */

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, User, AlertCircle } from "lucide-react";
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

export default function TodoCalendar({ tasks, onEditTask, projects }: TodoCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Générer les jours du calendrier
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Premier jour de la semaine à afficher (peut être du mois précédent)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Dernier jour de la semaine à afficher (peut être du mois suivant)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
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
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === today.toDateString(),
        tasks: dayTasks
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate, tasks]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Aujourd'hui
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-700 rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-700 rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 h-full">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`border border-gray-700 rounded-lg p-2 min-h-[120px] ${
                day.isCurrentMonth ? 'bg-gray-800' : 'bg-gray-850'
              } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              {/* Date */}
              <div className={`text-sm font-medium mb-1 ${
                day.isCurrentMonth ? 'text-white' : 'text-gray-500'
              } ${day.isToday ? 'text-blue-400' : ''}`}>
                {day.date.getDate()}
              </div>

              {/* Tasks */}
              <div className="space-y-1">
                {day.tasks.slice(0, 3).map((task) => {
                  const project = getProjectById(task.project || '');
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-1 rounded text-xs cursor-pointer hover:shadow-sm transition-shadow border-l-2 ${
                        getTaskStatusColor(task.status)
                      } ${isOverdue ? 'bg-red-900' : 'bg-gray-700'}`}
                      title={`${task.title} - ${task.description || ''}`}
                    >
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getTaskPriorityColor(task.priority)}`} />
                        <span className="truncate font-medium text-white">{task.title}</span>
                        {isOverdue && <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-1">
                          {task.assignee && (
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-300 truncate max-w-[60px]">
                                {task.assignee.split(' ')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {task.estimatedTime && (
                            <>
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-300">{task.estimatedTime}h</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {project && (
                        <div className="mt-1">
                          <span 
                            className="text-xs px-1 py-0.5 rounded"
                            style={{ backgroundColor: `${project.color}20`, color: project.color }}
                          >
                            {project.name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {day.tasks.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{day.tasks.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
