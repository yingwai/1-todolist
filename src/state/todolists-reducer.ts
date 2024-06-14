import { v1 } from 'uuid'
import { TodolistType } from '../App'
import { Dispatch } from 'redux'
import { todolistAPI } from '../api/todolist-api'


export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
        id: string
        title: string
    }
}
export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    payload: {
        id: string
        title: string
    }
}
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>

type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | SetTodolistActionType;

let initTodolistState: TodolistType[] = [];


export const todolistsReducer = (state = initTodolistState, action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.payload.todolists;
        case "ADD-TODOLIST":
            const newTodolist = { id: action.payload.id, title: action.payload.title }

            return [...state, newTodolist];
        case "REMOVE-TODOLIST":
            return state.filter(el => el.id !== action.payload.id);
        case "CHANGE-TODOLIST-TITLE":
            return state.map(el => el.id === action.payload.id ? { ...el, title: action.payload.title } : el);
        default:
            return state;
    }
}

export const addTodolistAC = (title: string): AddTodolistActionType => {
    return { type: 'ADD-TODOLIST', payload: { id: v1(), title } } as const
}

export const removeTodolistAC = (id: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', payload: { id } } as const
}

export const changeTitleTodolistAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE', payload: { id, title } } as const
}

export const setTodolistsAC = (todolists: TodolistType[]) => {
    return { type: 'SET-TODOLISTS', payload: { todolists } } as const
}

export const getTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTodolists()
            .then(res => {                
                dispatch(setTodolistsAC(res.data))
            })
    }
}