import { Dispatch } from "redux";
import { todolistAPI } from "../api/todolist-api";
import { RequestStatusType, setAppStatusAC, STATUS_CODE } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { TodolistType } from "../pages/Todolist/Todolist";

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;

export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST";
    payload: {
        id: string;
    };
};

export type ChangeTodolistTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE";
    payload: {
        id: string;
        title: string;
    };
};
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>;

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | SetTodolistActionType;

let initTodolistState: TodolistType[] = [];

export const todolistsReducer = (state = initTodolistState, action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return action.payload.todolists;
        case "ADD-TODOLIST":
            return [action.payload.todolist, ...state];
        case "REMOVE-TODOLIST":
            return state.filter((el) => el.id !== action.payload.id);
        case "CHANGE-TODOLIST-TITLE":
            return state.map((el) => (el.id === action.payload.id ? { ...el, title: action.payload.title } : el));
        default:
            return state;
    }
};

export const addTodolistAC = (todolist: TodolistType) => {
    return { type: "ADD-TODOLIST", payload: { todolist } } as const;
};

export const removeTodolistAC = (id: string): RemoveTodolistActionType => {
    return { type: "REMOVE-TODOLIST", payload: { id } } as const;
};

export const changeTitleTodolistAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return { type: "CHANGE-TODOLIST-TITLE", payload: { id, title } } as const;
};

export const setTodolistsAC = (todolists: TodolistType[]) => {
    return { type: "SET-TODOLISTS", payload: { todolists } } as const;
};

export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
    ({ type: "CHANGE-TODOLIST-ENTITY-STATUS", payload: { id, status } }) as const;

// Thunk

export const getTodolistsTC = () => {    
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC(STATUS_CODE.loading));
        todolistAPI
            .getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data));
                dispatch(setAppStatusAC(STATUS_CODE.succeeded));
            })
            .catch((error) => {
                handleServerNetworkError(dispatch, error);
            });
    };
};

export const createTodolistsTC = (title: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI
            .createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item));
                } else {
                    handleServerAppError(dispatch, res.data);
                }
            })
            .catch((error) => {
                handleServerNetworkError(dispatch, error);
            });
    };
};

export const deleteTodolistsTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.loading));
        todolistAPI
            .deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId));
                } else {
                    handleServerAppError(dispatch, res.data);
                }
            })
            .catch((error) => {
                handleServerNetworkError(dispatch, error);
            });
    };
};

export const updateTodolistsTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.loading));
        todolistAPI
            .changeTitleTodolist(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTitleTodolistAC(todolistId, title));
                    dispatch(changeTodolistEntityStatusAC(todolistId, STATUS_CODE.idle));
                } else {
                    handleServerAppError(dispatch, res.data);
                }
            })
            .catch((error) => {
                handleServerNetworkError(dispatch, error);
            });
    };
};
