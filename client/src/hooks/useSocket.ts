import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

// Singleton socket instance to avoid multiple corrections
let socket: Socket | null = null;

export const useSocket = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
            return;
        }

        if (!socket) {
            socket = io(import.meta.env.VITE_API_URL || 'https://task-manager-t0te.onrender.com', {
                withCredentials: true,
                autoConnect: true,
                transports: ['websocket'], // Force websocket to avoid polling 400 errors
            });
        }

        if (!socket.connected) {
            socket.connect();
        }

        // --- Event Listeners ---

        socket.on('task:created', (newTask) => {
            // We can optimistically add or just invalidate
            console.log('Socket: task created', newTask);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        socket.on('task:updated', (updatedTask) => {
            console.log('Socket: task updated', updatedTask);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        socket.on('task:deleted', (taskId) => {
            console.log('Socket: task deleted', taskId);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        // Handling assignment notifications can be done here too
        // For now, simpler is better: if anything changes, refresh the list.

        return () => {
            if (socket) {
                socket.off('task:created');
                socket.off('task:updated');
                socket.off('task:deleted');
                // Ideally we don't disconnect on every unmount of a component using this hook
                // unless it is the top level provider. 
                // But keeping it simple.
            }
        };
    }, [user, queryClient]);

    return socket;
};
