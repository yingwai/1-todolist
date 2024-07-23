import { ResultCode, todolistAPI } from "../api/todolist-api";
import { STATUS_CODE } from "./app-reducer";
import { TodolistType } from "../pages/Todolist/Todolist";
import { createSlice } from "@reduxjs/toolkit";
import { tasksActions } from "./tasksSlice";
import { authThunk } from "pages/Login/authSlice";
import { createAppAsyncThunk, handleServerAppError } from "utils";
import { thunkTryCatch } from "utils/thunk-try-catch";

const slice = createSlice({
    name: "todolists",
    initialState: [] as TodolistType[],
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(authThunk.logout.fulfilled, (state, action) => {
                if (!action.payload.isLoggedIn) return []
            })
            .addCase(getTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state.push(tl);
                })
            })
            .addCase(createTodolists.fulfilled, (state, action) => {
                state.unshift(action.payload.todolist)
            })
            .addCase(deleteTodolists.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(updateTodolists.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                if (index !== -1) state[index].title = action.payload.title
            })
    },
    selectors: {
        selectTodolists: state => state
    }
})

// Thunk

export const getTodolists = createAppAsyncThunk<
    { todolists: TodolistType[] },
    void
>(
    `${slice.name}/getTodolists`, (_, thunkAPI) => {
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistAPI.getTodolists()

            return { todolists: res.data }
        })
    }
)
export const createTodolists = createAppAsyncThunk<
    { todolist: TodolistType },
    string
>(
    `${slice.name}/createTodolists`, (title: string, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistAPI.createTodolist(title)

            if (res.data.resultCode === ResultCode.success) {
                return { todolist: res.data.data.item }
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        })
    }
)
export const deleteTodolists = createAppAsyncThunk<
    { id: string },
    string
>(
    `${slice.name}/deleteTodolists`, (todolistId: string, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.loading }))

            const res = await todolistAPI.deleteTodolist(todolistId)

            if (res.data.resultCode === ResultCode.success) {
                return { id: todolistId }
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        })
    }
)
export const updateTodolists = createAppAsyncThunk<
    { id: string, title: string },
    { todolistId: string, title: string }
>(
    `${slice.name}/updateTodolists`, (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            dispatch(tasksActions.changeTodolistEntityStatus({ id: arg.todolistId, status: STATUS_CODE.loading }))

            const res = await todolistAPI.changeTitleTodolist(arg)

            if (res.data.resultCode === ResultCode.success) {
                dispatch(tasksActions.changeTodolistEntityStatus({ id: arg.todolistId, status: STATUS_CODE.idle }))
                return { id: arg.todolistId, title: arg.title }
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        })
    }
)

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunk = { getTodolists, createTodolists, deleteTodolists };
export const { selectTodolists } = slice.selectors