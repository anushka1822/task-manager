import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import { type Task, Status, Priority } from '../types';
import TaskCard from '../components/Task/TaskCard';
import TaskFilters from '../components/Task/TaskFilters';
import TaskModal from '../components/Task/TaskModal';
import TaskSkeleton from '../components/Task/TaskSkeleton';

export default function DashboardPage() {
    const { tasks, isLoading, createTask, updateTask, deleteTask, updateTaskStatus } = useTasks();

    // -- Local State --
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
    const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
    const [viewFilter, setViewFilter] = useState<'ALL' | 'ASSIGNED' | 'CREATED'>('ALL');
    const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt'>('dueDate');

    // -- Modal State --
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const { user } = useAuth(); // Need user ID for filtering

    // -- Derived State (Filtering & Sorting) --
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                (task.description?.toLowerCase() || '').includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
            const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

            let matchesView = true;
            if (viewFilter === 'ASSIGNED') {
                matchesView = task.assignedToId === user?.id;
            } else if (viewFilter === 'CREATED') {
                matchesView = task.creatorId === user?.id;
            }

            return matchesSearch && matchesStatus && matchesPriority && matchesView;
        }).sort((a, b) => {
            const dateA = new Date(a[sortBy]).getTime();
            const dateB = new Date(b[sortBy]).getTime();
            return dateA - dateB; // Ascending
        });
    }, [tasks, search, statusFilter, priorityFilter, viewFilter, sortBy, user]);


    // -- Handlers --
    const handleCreate = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask.mutateAsync(id);
        }
    };

    const handleStatusChange = async (id: string, status: Status) => {
        await updateTaskStatus.mutateAsync({ id, status });
    };

    const handleSubmit = async (data: any) => {
        if (editingTask) {
            await updateTask.mutateAsync({ id: editingTask.id, data });
        } else {
            await createTask.mutateAsync(data);
        }
        setIsModalOpen(false);
    };

    // if (isLoading) return <div className="text-center mt-20">Loading tasks...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                    <p className="text-gray-500 mt-1">Manage and track your work</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    New Task
                </button>
            </div>

            <TaskFilters
                search={search} setSearch={setSearch}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                viewFilter={viewFilter} setViewFilter={setViewFilter}
                sortBy={sortBy} setSortBy={setSortBy}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [...Array(6)].map((_, i) => <TaskSkeleton key={i} />)
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                )}
            </div>

            {filteredTasks.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No tasks found matching your filters.</p>
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingTask}
                isSubmitting={createTask.isPending || updateTask.isPending}
            />
        </div>
    );
}
