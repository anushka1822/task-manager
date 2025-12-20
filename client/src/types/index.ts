export type User = {
    id: string;
    name: string;
    email: string;
};

export const Priority = {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
    Urgent: 'Urgent',
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export const Status = {
    ToDo: 'ToDo',
    InProgress: 'InProgress',
    Review: 'Review',
    Completed: 'Completed',
} as const;

export type Status = typeof Status[keyof typeof Status];

export const STATUS_LABELS: Record<Status, string> = {
    [Status.ToDo]: 'To Do',
    [Status.InProgress]: 'In Progress',
    [Status.Review]: 'Review',
    [Status.Completed]: 'Completed',
};

export type Task = {
    id: string;
    title: string;
    description?: string;
    dueDate: string; // ISO date string
    priority: Priority;
    status: Status;
    creatorId: string;
    assignedToId?: string;
    createdAt: string;
    updatedAt: string;
    assignee?: User;
    creator?: User;
};
