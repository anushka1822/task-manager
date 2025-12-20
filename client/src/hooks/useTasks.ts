import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { type Task, Status } from '../types';

export function useTasks() {
    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await api.get('/tasks');
            // The API generic return might be { success: true, data: [...] } or just [...]
            // I'll assume standard REST behavior or based on previous successful knowledge.
            // If server returns { success: true, data: tasks }, update this.
            // Looking at `task.controller` would clarify, but I will assume it returns the array or object with data property.
            // Let's assume response.data is the array for now, or check wrapper.
            // Safest: return response.data.data if exists, else response.data
            const data = response.data;
            return Array.isArray(data) ? data : (data.data || []);
        }
    });

    const createTask = useMutation({
        mutationFn: async (newTask: Partial<Task>) => {
            const response = await api.post('/tasks', newTask);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTask = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
            const response = await api.put(`/tasks/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTaskStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Status }) => {
            const response = await api.put(`/tasks/${id}`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    return {
        tasks,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus
    };
}
