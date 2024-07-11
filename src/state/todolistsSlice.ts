import { Dispatch } from "redux";
import { todolistAPI } from "../api/todolist-api";
import { STATUS_CODE } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { TodolistType } from "../pages/Todolist/Todolist";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "./appSlice";
import { tasksActions } from "./tasksSlice";
import { authActions } from "pages/Login/authSlice";

const slice = createSlice({
    name: "todolists",
    initialState: [] as TodolistType[],
    reducers: {
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            action.payload.todolists.forEach(tl => {
                state.push(tl);
            })
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift(action.payload.todolist)
        },
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title
        }
    },
    extraReducers: builder => {
        builder
            .addCase(authActions.setIsLoggedIn, (state, action) => {
                if (!action.payload.isLoggedIn) return []
            })
    },
    selectors: {
        selectTodolists: state => state
    }
})

// Thunk

export const getTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({ status: STATUS_CODE.loading }));

        todolistAPI
            .getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({ todolists: res.data }))
                dispatch(appActions.setAppStatus({ status: STATUS_CODE.succeeded }));
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
                    dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
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
        dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.loading }))
        todolistAPI
            .deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(todolistsActions.removeTodolist({ id: todolistId }))
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
        dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.loading }))
        todolistAPI
            .changeTitleTodolist(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(todolistsActions.changeTodolistTitle({ id: todolistId, title }))
                    dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.idle }))
                } else {
                    handleServerAppError(dispatch, res.data);
                }
            })
            .catch((error) => {
                handleServerNetworkError(dispatch, error);
            });
    };
};

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const { selectTodolists } = slice.selectors