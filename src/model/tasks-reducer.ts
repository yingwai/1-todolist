import { v1 } from 'uuid'
import { TasksStateType } from '../App';
import { AddTodolistActionType, RemoveTodolistActionType } from './todolists-reducer';


export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

type ActionsType = AddTaskActionType | RemoveTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType | AddTodolistActionType | RemoveTodolistActionType;

let todolistID1 = v1()
let todolistID2 = v1()

const initialState: TasksStateType = {
    [todolistID1]: {
        data: [
            { id: v1(), title: 'HTML&CSS', isDone: true },
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'ReactJS', isDone: false },
        ],
        filter: 'all'
    },
    [todolistID2]: {
        data: [
            { id: v1(), title: 'Rest API', isDone: true },
            { id: v1(), title: 'GraphQL', isDone: false },
        ],
        filter: 'all'
    },
};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
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
        case 'ADD-TODOLIST':
            return {...state, [action.payload.id]: {data: [], filter: 'all'}}
        case 'REMOVE-TODOLIST':
            
            let copyState = {...state}
            delete(copyState[action.payload.id])
            return copyState
        default:
            throw new Error("undefind command");
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