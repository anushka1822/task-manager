import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { type Task, Priority, Status, STATUS_LABELS } from '../../types';
import api from '../../lib/axios';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title max 100 chars'),
    description: z.string().optional(),
    dueDate: z.string().min(1, 'Due date is required'),
    priority: z.nativeEnum(Priority),
    status: z.nativeEnum(Status),
    assignedToId: z.string().optional()
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => Promise<void>;
    initialData?: Task | null;
    isSubmitting: boolean;
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: TaskModalProps) {
    const [users, setUsers] = useState<{ id: string, name: string }[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            priority: Priority.Medium,
            status: Status.ToDo,
            assignedToId: ""
        },
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/auth/users');
                if (res.data.success) {
                    setUsers(res.data.users);
                }
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                description: initialData.description || '',
                dueDate: initialData.dueDate.split('T')[0], // Format for input type="date"
                priority: initialData.priority,
                status: initialData.status,
                assignedToId: initialData.assignedToId || ""
            });
        } else {
            reset({
                priority: Priority.Medium,
                status: Status.ToDo,
                title: '',
                description: '',
                dueDate: '',
                assignedToId: ""
            });
        }
    }, [initialData, isOpen, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit((data) => {
                    const formattedData = {
                        ...data,
                        dueDate: new Date(data.dueDate).toISOString(),
                        assignedToId: data.assignedToId === "" ? undefined : data.assignedToId
                    };
                    onSubmit(formattedData);
                })} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            {...register('title')}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Task title"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Task details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                {...register('dueDate')}
                                type="date"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                {...register('priority')}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {Object.values(Priority).map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                {...register('status')}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {Object.values(Status).map((s) => (
                                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign User</label>
                            <select
                                {...register('assignedToId')}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Unassigned</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

