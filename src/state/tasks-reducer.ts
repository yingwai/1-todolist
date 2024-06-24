import { AddTodolistActionType, changeTodolistEntityStatusAC, RemoveTodolistActionType, SetTodolistActionType } from './todolists-reducer';
import { TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType } from '../api/todolist-api';
import { Dispatch } from 'redux';
import { AppRootStateType } from './store';
import { setAppStatusAC, STATUS_CODE } from './app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';
import { FilterValueType, TasksStateType } from '../pages/Todolist/Todolist';


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
    | ChangeTaskFilterActionType
    | SetTodolistActionType
    | ReturnType<typeof setTaskAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>;

const initTaskState: TasksStateType = {}

export const tasksReducer = (state = initTaskState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const stateCopy = { ...state }

            action.payload.todolists.forEach((tl) => {
                stateCopy[tl.id] = {
                    data: [],
                    filter: "all",
                    entityStatus: STATUS_CODE.idle
                }
            })

            return stateCopy;
        }
        case 'SET-TASK':
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], data: action.payload.tasks } }
        case "ADD-TASK":
            return { ...state, [action.payload.task.todoListId]: { ...state[action.payload.task.todoListId], data: [action.payload.task, ...state[action.payload.task.todoListId].data] } };
        case "REMOVE-TASK":
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], data: state[action.payload.todolistId].data.filter(el => el.id !== action.payload.taskId) } };
        case 'CHANGE-TASK-STATUS':
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], data: state[action.payload.todolistId].data.map(task => task.id === action.payload.taskId ? { ...task, status: action.payload.status } : task) } }
        case 'CHANGE-TASK-TITLE':
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], data: state[action.payload.todolistId].data.map(task => task.id === action.payload.taskId ? { ...task, title: action.payload.newTitle } : task) } }
        case 'CHANGE-TASK-FILTER':
            return { ...state, [action.payload.todolistId]: { ...state[action.payload.todolistId], filter: action.payload.value } }
        case 'ADD-TODOLIST':
            return { ...state, [action.payload.todolist.id]: { data: [], filter: 'all', entityStatus: STATUS_CODE.idle } }
        case 'REMOVE-TODOLIST':
            let copyState = { ...state }
            delete (copyState[action.payload.id])
            return copyState;
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return { ...state, [action.payload.id]: { ...state[action.payload.id], entityStatus: action.payload.status } }
        default:
            return state;
    }
}

export const addTaskAC = (task: TaskType) => {
    return { type: 'ADD-TASK', payload: { task } } as const
}
export const removeTaskAC = (todolistId: string, taskId: string) => {
    return { type: 'REMOVE-TASK', payload: { todolistId, taskId } } as const
}
export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return { type: 'CHANGE-TASK-STATUS', payload: { todolistId, taskId, status } } as const
}
export const changeTaskTitleAC = (todolistId: string, taskId: string, newTitle: string) => {
    return { type: 'CHANGE-TASK-TITLE', payload: { todolistId, taskId, newTitle } } as const
}
export const changeTaskFilterAC = (todolistId: string, value: FilterValueType) => {
    return { type: 'CHANGE-TASK-FILTER', payload: { todolistId, value } } as const
}
export const setTaskAC = (todolistId: string, tasks: TaskType[]) => {
    return { type: 'SET-TASK', payload: { todolistId, tasks } } as const
}


// Thunk

export const getTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC(STATUS_CODE.loading))
        todolistAPI.getTasks(todolistId)
            .then(res => {
                if (res.data.error === null) {
                    dispatch(setTaskAC(todolistId, res.data.items))
                    dispatch(setAppStatusAC(STATUS_CODE.succeeded))
                } else {
                    handleServerAppError(dispatch, res.data.error)
                }
            })
            .catch(error => {
                handleServerNetworkError(dispatch, error)
            })
    }
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.loading))
    todolistAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(todolistId, taskId))
                dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.idle))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.loading))
        const tasks = getState().tasks;
        const task = tasks[todolistId].data.find(t => t.id === taskId)

        if (task) {
            const model: UpdateTaskModelType = {
                title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
            }

            todolistAPI.updateTask(todolistId, taskId, model)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskTitleAC(todolistId, taskId, title))
                        dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.idle))
                    } else {
                        handleServerAppError(dispatch, res.data)
                    }
                })
                .catch(error => {
                    handleServerNetworkError(dispatch, error)
                })
        }
    }
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.loading))
        const tasks = getState().tasks;
        const task = tasks[todolistId].data.find(t => t.id === taskId)

        if (task) {
            const model: UpdateTaskModelType = {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status,
            }

            todolistAPI.updateTask(todolistId, taskId, model)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskStatusAC(todolistId, taskId, status))
                        dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.idle))
                    } else {
                        handleServerAppError(dispatch, res.data)
                    }
                })
                .catch(error => {
                    handleServerNetworkError(dispatch, error)
                })
        }
    }
}