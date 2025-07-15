/**
 * Composant tableau Kanban pour les tâches TODO avec drag & drop
 */

import { useState } from "react";
import { MoreHorizontal, Clock, User, Tag, Calendar } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TODO_STATUSES, TODO_TYPES, TODO_PRIORITIES } from "../../types/todo";
import type { TodoTask, TodoProject, TodoStatus } from "../../types/todo";

interface TodoBoardProps {
  tasks: TodoTask[];
  tasksByStatus: Record<TodoStatus, TodoTask[]>;
  onEditTask: (task: TodoTask) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<TodoTask>) => void;
  projects: TodoProject[];
}

export default function TodoBoard({
  tasksByStatus,
  onEditTask,
  onUpdateTask,
  projects,
}: TodoBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<TodoTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTypeConfig = (type: string) => {
    return TODO_TYPES.find((t) => t.value === type) || TODO_TYPES[0];
  };

  const getPriorityConfig = (priority: string) => {
    return (
      TODO_PRIORITIES.find((p) => p.value === priority) || TODO_PRIORITIES[0]
    );
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null;
    const project = projects.find((p) => p.id === projectId);
    return project?.name || null;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Trouve la tâche dans toutes les colonnes
    const task = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === active.id);

    setDraggedTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setDraggedTask(null);
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Trouver la tâche qui a été déplacée
    const activeTask = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === activeId);
    
    if (!activeTask) return;
    
    // Si on drop sur une autre tâche ou sur une colonne
    if (overId !== activeId) {
      // Chercher dans quelle colonne se trouve la cible
      let targetStatus: TodoStatus | null = null;
      let targetIndex: number | null = null;
      
      // Vérifier si overId correspond à une colonne
      if (TODO_STATUSES.some((status) => status.value === overId)) {
        targetStatus = overId as TodoStatus;
        // Placer à la fin de la colonne
        targetIndex = tasksByStatus[targetStatus]?.length || 0;
      } else {
        // Sinon, trouver la colonne de la tâche cible
        for (const [status, tasks] of Object.entries(tasksByStatus)) {
          const taskIndex = tasks.findIndex((task) => task.id === overId);
          if (taskIndex !== -1) {
            targetStatus = status as TodoStatus;
            targetIndex = taskIndex;
            break;
          }
        }
      }
      
      // Si on a trouvé un statut cible
      if (targetStatus) {
        if (targetStatus !== activeTask.status) {
          // Changement de colonne
          onUpdateTask(activeId, { status: targetStatus });
        } else if (targetIndex !== null) {
          // Réorganisation dans la même colonne
          const currentTasks = tasksByStatus[targetStatus];
          const activeIndex = currentTasks.findIndex(t => t.id === activeId);
          
          if (activeIndex !== -1 && activeIndex !== targetIndex) {
            // Créer un nouvel ordre pour les tâches
            const reorderedTasks = [...currentTasks];
            const [movedTask] = reorderedTasks.splice(activeIndex, 1);
            reorderedTasks.splice(targetIndex, 0, movedTask);
            
            // Mettre à jour l'ordre de toutes les tâches affectées
            reorderedTasks.forEach((task, index) => {
              onUpdateTask(task.id, { order: index });
            });
          }
        }
      }
    }
  };

  const DraggableTaskCard = ({ task }: { task: TodoTask }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const typeConfig = getTypeConfig(task.type);
    const priorityConfig = getPriorityConfig(task.priority);
    const projectName = getProjectName(task.project);

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm leading-tight pr-2">
            {task.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            className="text-gray-400 hover:text-gray-600 p-1 -m-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {task.description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}
          >
            <span className="mr-1">{typeConfig.icon}</span>
            {typeConfig.label}
          </span>

          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}
          >
            <span className="mr-1">{priorityConfig.icon}</span>
            {priorityConfig.label}
          </span>

          {projectName && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              📁 {projectName}
            </span>
          )}
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <div className="flex items-center space-x-2">
            {task.assignee && (
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {task.assignee}
              </span>
            )}
            {task.estimatedTime && (
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {task.estimatedTime}h
              </span>
            )}
          </div>
          {task.dueDate && (
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Boutons de changement de statut rapide */}
        <div className="flex justify-center space-x-1 mt-2 pt-2 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateTask(task.id, { status: "in-progress" });
            }}
            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
            title="En cours"
          >
            📝
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateTask(task.id, { priority: "high" });
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Priorité haute"
          >
            ⚡
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateTask(task.id, { status: "done" });
            }}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Terminé"
          >
            ✅
          </button>
        </div>
      </div>
    );
  };

  const DroppableColumn = ({
    status,
    tasks,
  }: {
    status: TodoStatus;
    tasks: TodoTask[];
  }) => {
    const { setNodeRef } = useDroppable({
      id: status,
    });

    const statusConfig = TODO_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return null;

    return (
      <div className="flex-1 min-w-0">
        <div 
          ref={setNodeRef}
          className="bg-gray-50 rounded-lg p-4 h-full min-h-[500px]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center">
              <span className="mr-2">{statusConfig.icon}</span>
              {statusConfig.label}
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {tasks.length}
              </span>
            </h2>
          </div>

          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="min-h-[200px] space-y-2">
              {tasks.map((task) => (
                <DraggableTaskCard key={task.id} task={task} />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {TODO_STATUSES.map(({ value: status }) => (
            <DroppableColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status] || []}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId && draggedTask ? (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 opacity-90 rotate-3 transform">
              <h3 className="font-medium text-gray-900 text-sm">
                {draggedTask.title}
              </h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
