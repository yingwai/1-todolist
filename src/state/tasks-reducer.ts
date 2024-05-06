import { v1 } from 'uuid'
import { FilterValueType, TasksStateType } from '../App';
import { AddTodolistActionType, RemoveTodolistActionType } from './todolists-reducer';


export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type ChangeTaskFilterActionType = ReturnType<typeof changeTaskFilterAC>

type ActionsType = AddTaskActionType
    | RemoveTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | ChangeTaskFilterActionType;

const initTaskState: TasksStateType = {}

export const tasksReducer = (state = initTaskState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "ADD-TASK":
            const newTask = {
                id: v1(),
                title: action.payload.taskTitle,
                isDone: false
            }

            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], data: [newTask, ...state[action.payload.todolistId].data] } }
        case "REMOVE-TASK":
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], data: state[action.payload.todolistId].data.filter(el => el.id !== action.payload.taskId) } };
        case 'CHANGE-TASK-STATUS':
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], data: state[action.payload.todolistId].data.map(task => task.id === action.payload.taskId ? { ...task, isDone: action.payload.value } : task) } }
        case 'CHANGE-TASK-TITLE':
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], data: state[action.payload.todolistId].data.map(task => task.id === action.payload.taskId ? { ...task, title: action.payload.newTitle } : task) } }
        case 'CHANGE-TASK-FILTER':
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], filter: action.payload.value } }
        case 'ADD-TODOLIST':            
            return { ...state, [action.payload.id]: { data: [], filter: 'all' } }
        case 'REMOVE-TODOLIST':
            let copyState = { ...state }
            delete (copyState[action.payload.id])
            return copyState
        default:
            return state;
    }
}

export const addTaskAC = (todolistId: string, taskTitle: string) => {
    return { type: 'ADD-TASK', payload: { todolistId, taskTitle } } as const
}
export const removeTaskAC = (todolistId: string, taskId: string) => {
    return { type: 'REMOVE-TASK', payload: { todolistId, taskId } } as const
}
export const changeTaskStatusAC = (todolistId: string, taskId: string, taskValue: boolean) => {
    return { type: 'CHANGE-TASK-STATUS', payload: { todolistId, taskId, value: taskValue } } as const
}
export const changeTaskTitleAC = (todolistId: string, taskId: string, newTitle: string) => {
    return { type: 'CHANGE-TASK-TITLE', payload: { todolistId, taskId, newTitle } } as const
}
export const changeTaskFilterAC = (todolistId: string, value: FilterValueType) => {
    return { type: 'CHANGE-TASK-FILTER', payload: { todolistId, value } } as const
}