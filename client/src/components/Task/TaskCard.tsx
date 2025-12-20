import { format } from 'date-fns';
import { Calendar, MoreVertical, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { type Task, Priority, Status, STATUS_LABELS } from '../../types';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onStatusChange: (taskId: string, status: Status) => void;
}

const priorityColors = {
    [Priority.Low]: 'bg-blue-100 text-blue-800',
    [Priority.Medium]: 'bg-yellow-100 text-yellow-800',
    [Priority.High]: 'bg-orange-100 text-orange-800',
    [Priority.Urgent]: 'bg-red-100 text-red-800',
};

const statusColors = {
    [Status.ToDo]: 'bg-gray-100 text-gray-800',
    [Status.InProgress]: 'bg-blue-50 text-blue-700 border-blue-200',
    [Status.Review]: 'bg-purple-50 text-purple-700 border-purple-200',
    [Status.Completed]: 'bg-green-50 text-green-700 border-green-200',
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Parse date safely
    const dueDate = new Date(task.dueDate);
    const isOverdue = new Date() > dueDate && task.status !== Status.Completed;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-4 relative group">

            {/* Priority Badge */}
            <div className="absolute top-4 right-12 flex gap-2">
                {isOverdue && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600">
                        <AlertCircle className="w-3 h-3 mr-1" /> Overdue
                    </span>
                )}
                <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", priorityColors[task.priority])}>
                    {task.priority}
                </span>
            </div>

            {/* Menu Button */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
                {isMenuOpen && (
                    <div
                        className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1"
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        <button
                            onClick={() => { onEdit(task); setIsMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <Edit2 className="w-3 h-3 mr-2" /> Edit
                        </button>
                        <button
                            onClick={() => { onDelete(task.id); setIsMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                            <Trash2 className="w-3 h-3 mr-2" /> Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1">{task.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5em]">{task.description || "No description"}</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {format(dueDate, 'MMM d, yyyy')}
                </div>

                {/* Status Dropdown (Simplified as a badge that cycles or select) */}
                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
                    className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 appearance-none",
                        statusColors[task.status]
                    )}
                >
                    {Object.values(Status).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                </select>
            </div>

            {task.assignee && (
                <div className="mt-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {task.assignee.name.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500">Assigned to {task.assignee.name}</span>
                </div>
            )}

            {task.creator && (
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Created by {task.creator.name}</span>
                </div>
            )}
        </div>
    );
}
