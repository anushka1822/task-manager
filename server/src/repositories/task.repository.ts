import { PrismaClient, Task } from "@prisma/client";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";

const prisma = new PrismaClient();

// Create a new task
export const createTask = async (data: CreateTaskDto, creatorId: string) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status as any, // Cast string to Enum if needed
      dueDate: data.dueDate,
      creatorId: creatorId, // Link to logged-in user
      assignedToId: data.assignedToId,
    },
    include: { assignee: true, creator: true } // Return user details
  });
};

// Get all tasks (with filters support later)
// Get all tasks visible to the user (Created by them OR Assigned to them)
export const getAllTasks = async (userId: string) => {
  return await prisma.task.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { assignedToId: userId }
      ]
    },
    include: { assignee: true, creator: true },
    orderBy: { createdAt: 'desc' }
  });
};

export const getTaskById = async (id: string) => {
  return await prisma.task.findUnique({
    where: { id },
    include: { assignee: true, creator: true }
  });
};

// Get tasks for a specific user (Dashboard requirement) 
export const getTasksByAssignee = async (userId: string) => {
  return await prisma.task.findMany({
    where: { assignedToId: userId },
    include: { creator: true }
  });
};

export const updateTask = async (id: string, data: UpdateTaskDto) => {
  return await prisma.task.update({
    where: { id },
    data: {
      ...data,
      status: data.status as any
    },
    include: { assignee: true }
  });
};

export const deleteTask = async (id: string) => {
  return await prisma.task.delete({
    where: { id }
  });
};