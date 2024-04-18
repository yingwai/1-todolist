import { v1 } from 'uuid'
import { TodolistType } from '../App'


export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
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

type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType

let todolistID1 = v1()
let todolistID2 = v1()

const initialState: TodolistType[] = [
    { id: todolistID1, title: 'What to learn' },
    { id: todolistID2, title: 'What to buy' },
];

export const todolistsReducer = (state: TodolistType[] = initialState, action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case "ADD-TODOLIST":
            const newTodolist = { id: v1(), title: "New Todolist" }

            return [...state, newTodolist];
        case "REMOVE-TODOLIST":
            return state.filter(el => el.id !== action.payload.id);
        case "CHANGE-TODOLIST-TITLE":
            return state.map(el => el.id === action.payload.id ? { ...el, title: 'New Todolist' } : el);
        default:
            throw new Error("undefind command");
    }
}

export const addTodolistAC = (title: string): AddTodolistActionType => {
    return { type: 'ADD-TODOLIST', payload: { title } } as const
}

export const removeTodolistAC = (id: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', payload: { id } } as const
}

export const changeTitleTodolistAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE', payload: { id, title } } as const
}