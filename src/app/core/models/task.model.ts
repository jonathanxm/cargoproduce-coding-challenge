import { TaskState } from "../enums/task-state.enum";

export interface Task {
    id?: number;
    title?: string;
    state?: TaskState;
    date?: Date;
    description?: string;
    spentTime?: number;
    lastStartDate?: Date;
}