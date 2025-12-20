import * as taskRepo from "../repositories/task.repository";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { io } from "../server"; // Import the socket instance

/**
 * Creates a new task and notifies connected clients via Socket.io.
 * @param data - The task data from the request body.
 * @param creatorId - The ID of the authenticated user creating the task.
 * @returns The created task with assignee and creator populated.
 */
export const createTask = async (data: CreateTaskDto, creatorId: string) => {
  const newTask = await taskRepo.createTask(data, creatorId);

  // Real-Time: Notify everyone that a new task exists
  io.emit("task:created", newTask);

  // Real-Time: If assigned, notify the specific user (Bonus/Requirement)
  if (data.assignedToId) {
    io.to(data.assignedToId).emit("notification", {
      message: `You have been assigned to task: ${newTask.title}`,
      taskId: newTask.id
    });
  }

  return newTask;
};

/**
 * Retrieves all tasks from the database, ordered by creation date.
 * @returns Array of tasks with relations.
 */
/**
 * Retrieves all tasks visible to the authenticated user.
 * @param userId - The ID of the authenticated user.
 * @returns Array of tasks with relations.
 */
export const getAllTasks = async (userId: string) => {
  return await taskRepo.getAllTasks(userId);
};

/**
 * Updates an existing task and broadcasts the change via Socket.io.
 * Only Creator or Assignee can update.
 * @param id - The UUID of the task to update.
 * @param userId - The ID of the authenticated user.
 * @param data - The partial task data to update.
 * @returns The updated task.
 */
export const updateTask = async (id: string, userId: string, data: UpdateTaskDto) => {
  const task = await taskRepo.getTaskById(id);
  if (!task) throw { statusCode: 404, message: "Task not found" };

  // Permission Check: Creator OR Assignee
  if (task.creatorId !== userId && task.assignedToId !== userId) {
    throw { statusCode: 403, message: "Not authorized to update this task" };
  }

  const updatedTask = await taskRepo.updateTask(id, data);

  // Real-Time: Broadcast the update to everyone viewing the board [cite: 25]
  io.emit("task:updated", updatedTask);

  return updatedTask;
};

/**
 * Deletes a task by ID and broadcasts the deletion event.
 * Only Creator can delete.
 * @param id - The UUID of the task to delete.
 * @param userId - The ID of the authenticated user.
 * @returns Confirmation message.
 */
export const deleteTask = async (id: string, userId: string) => {
  const task = await taskRepo.getTaskById(id);
  if (!task) throw { statusCode: 404, message: "Task not found" };

  // Permission Check: Creator ONLY
  if (task.creatorId !== userId) {
    throw { statusCode: 403, message: "Not authorized to delete this task" };
  }

  await taskRepo.deleteTask(id);

  // Real-Time: Remove it from everyone's screen
  io.emit("task:deleted", id);

  return { message: "Task deleted successfully" };
};