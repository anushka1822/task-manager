import { Search, Filter, SortAsc } from 'lucide-react';
import { Priority, Status, STATUS_LABELS } from '../../types';

interface TaskFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    statusFilter: Status | 'ALL';
    setStatusFilter: (val: Status | 'ALL') => void;
    priorityFilter: Priority | 'ALL';
    setPriorityFilter: (val: Priority | 'ALL') => void;
    viewFilter: 'ALL' | 'ASSIGNED' | 'CREATED';
    setViewFilter: (val: 'ALL' | 'ASSIGNED' | 'CREATED') => void;
    sortBy: 'dueDate' | 'createdAt';
    setSortBy: (val: 'dueDate' | 'createdAt') => void;
}

export default function TaskFilters({
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    viewFilter, setViewFilter,
    sortBy, setSortBy
}: TaskFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search tasks..."
                />
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">

                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Filter className="w-4 h-4 text-gray-500 ml-2 mr-1" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
                        className="bg-transparent text-sm border-none focus:ring-0 text-gray-700 py-1 pl-1 pr-6 cursor-pointer"
                    >
                        <option value="ALL">All Status</option>
                        {Object.values(Status).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                </div>

                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Filter className="w-4 h-4 text-gray-500 ml-2 mr-1" />
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')}
                        className="bg-transparent text-sm border-none focus:ring-0 text-gray-700 py-1 pl-1 pr-6 cursor-pointer"
                    >
                        <option value="ALL">All Priorities</option>
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Filter className="w-4 h-4 text-gray-500 ml-2 mr-1" />
                    <select
                        value={viewFilter}
                        onChange={(e) => setViewFilter(e.target.value as 'ALL' | 'ASSIGNED' | 'CREATED')}
                        className="bg-transparent text-sm border-none focus:ring-0 text-gray-700 py-1 pl-1 pr-6 cursor-pointer"
                    >
                        <option value="ALL">All Tasks</option>
                        <option value="ASSIGNED">Assigned to Me</option>
                        <option value="CREATED">Created by Me</option>
                    </select>
                </div>

                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <SortAsc className="w-4 h-4 text-gray-500 ml-2 mr-1" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'createdAt')}
                        className="bg-transparent text-sm border-none focus:ring-0 text-gray-700 py-1 pl-1 pr-6 cursor-pointer"
                    >
                        <option value="dueDate">Due Date</option>
                        <option value="createdAt">Created Date</option>
                    </select>
                </div>

            </div>
        </div>
    );
}
