import { z } from "zod";

// Create Task Schema
export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]), // [cite: 19]
  status: z.enum(["ToDo", "InProgress", "Review", "Completed"]).optional(), // [cite: 20]
  dueDate: z.string().datetime({ message: "Invalid date format" }), // [cite: 18]
  assignedToId: z.string().uuid().optional(), // [cite: 22]
});

// Update Task Schema (Partial allows updating just one field)
export const UpdateTaskSchema = CreateTaskSchema.partial();

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;