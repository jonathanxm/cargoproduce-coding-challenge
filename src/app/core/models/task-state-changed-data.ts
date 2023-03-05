import { TaskState } from "../enums/task-state.enum";
import { TimerData } from "./timer-data.model";

export interface TaskStateChangedData {
    newState: TaskState;
    timerData?: TimerData;
}