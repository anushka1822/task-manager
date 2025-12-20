import { Request, Response, NextFunction } from "express";
import { CreateTaskSchema, UpdateTaskSchema } from "../dtos/task.dto";
import * as taskService from "../services/task.service";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input
    const validation = CreateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      throw { statusCode: 400, message: validation.error.issues[0].message };
    }

    // 2. Call Service (User ID comes from the middleware)
    // @ts-ignore
    const task = await taskService.createTask(validation.data, req.user.id);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const tasks = await taskService.getAllTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;
    const validation = UpdateTaskSchema.safeParse(req.body);

    if (!validation.success) {
      throw { statusCode: 400, message: validation.error.issues[0].message };
    }

    const task = await taskService.updateTask(id, userId, validation.data);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;
    await taskService.deleteTask(id, userId);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};