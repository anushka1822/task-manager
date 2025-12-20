import { createTask, getAllTasks, updateTask, deleteTask } from '../src/services/task.service';
import * as taskRepo from '../src/repositories/task.repository';
import { io } from '../src/server';

// Mock dependencies
jest.mock('../src/repositories/task.repository');
jest.mock('../src/server', () => ({
    io: {
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
    },
}));

describe('Task Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTask', () => {
        it('should create a task and emit socket event', async () => {
            const mockTask = { id: '1', title: 'Test Task', creatorId: 'user1' } as any;
            (taskRepo.createTask as jest.Mock).mockResolvedValue(mockTask);

            const result = await createTask(
                { title: 'Test Task', priority: 'Medium', dueDate: '2023-01-01', status: 'ToDo' },
                'user1'
            );

            expect(taskRepo.createTask).toHaveBeenCalled();
            expect(io.emit).toHaveBeenCalledWith('task:created', mockTask);
            expect(result).toEqual(mockTask);
        });

        it('should notify assignee if assignedToId is present', async () => {
            const mockTask = { id: '1', title: 'Test Task', creatorId: 'user1' } as any;
            (taskRepo.createTask as jest.Mock).mockResolvedValue(mockTask);

            await createTask(
                { title: 'Test Task', priority: 'Medium', dueDate: '2023-01-01', status: 'ToDo', assignedToId: 'user2' },
                'user1'
            );

            expect(io.to).toHaveBeenCalledWith('user2');
            expect(io.emit).toHaveBeenCalledWith('notification', expect.any(Object));
        });
    });

    describe('getAllTasks', () => {
        it('should return tasks for the specific user', async () => {
            const mockTasks = [{ id: '1', title: 'Task 1' }];
            (taskRepo.getAllTasks as jest.Mock).mockResolvedValue(mockTasks);

            const result = await getAllTasks('user1');

            expect(taskRepo.getAllTasks).toHaveBeenCalledWith('user1');
            expect(result).toEqual(mockTasks);
        });
    });

    describe('updateTask', () => {
        it('should update a task if user is creator', async () => {
            const mockTask = { id: '1', creatorId: 'user1', assignedToId: 'user2' };
            const mockUpdatedTask = { ...mockTask, title: 'Updated' };

            (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);
            (taskRepo.updateTask as jest.Mock).mockResolvedValue(mockUpdatedTask);

            const result = await updateTask('1', 'user1', { title: 'Updated' });

            expect(result).toEqual(mockUpdatedTask);
            expect(io.emit).toHaveBeenCalledWith('task:updated', mockUpdatedTask);
        });

        it('should update a task if user is assignee', async () => {
            const mockTask = { id: '1', creatorId: 'user1', assignedToId: 'user2' };
            const mockUpdatedTask = { ...mockTask, title: 'Updated' };

            (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);
            (taskRepo.updateTask as jest.Mock).mockResolvedValue(mockUpdatedTask);

            const result = await updateTask('1', 'user2', { title: 'Updated' });

            expect(result).toEqual(mockUpdatedTask);
        });

        it('should throw error if unauthorized user tries to update', async () => {
            const mockTask = { id: '1', creatorId: 'user1', assignedToId: 'user2' };
            (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);

            await expect(updateTask('1', 'user3', { title: 'Updated' }))
                .rejects.toEqual({ statusCode: 403, message: "Not authorized to update this task" });
        });
    });

    describe('deleteTask', () => {
        it('should delete a task if user is creator', async () => {
            const mockTask = { id: '1', creatorId: 'user1' };
            (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);
            (taskRepo.deleteTask as jest.Mock).mockResolvedValue(true);

            await deleteTask('1', 'user1');

            expect(taskRepo.deleteTask).toHaveBeenCalledWith('1');
            expect(io.emit).toHaveBeenCalledWith('task:deleted', '1');
        });

        it('should throw error if user is not creator', async () => {
            const mockTask = { id: '1', creatorId: 'user1' };
            (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);

            await expect(deleteTask('1', 'user2'))
                .rejects.toEqual({ statusCode: 403, message: "Not authorized to delete this task" });
        });
    });
});
