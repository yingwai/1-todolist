import {
    STATUS_CODE,
} from "../../state/app-reducer";
import { authAPI, LoginParamsType, ResultCode } from "../../api/todolist-api";
import { handleServerAppError } from "../../utils/handle-server-app-error";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "state/appSlice";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { createAppAsyncThunk } from "utils";

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(me.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    },
    selectors: {
        selectorAuthIsLoggedIn: state => state.isLoggedIn
    }
})

// Thunks

export const me = createAppAsyncThunk<
    { isLoggedIn: boolean },
    void
>(
    `${slice.name}/me`,
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        try {
            const res = await authAPI.me()

            if (res.data.resultCode === ResultCode.success) {
                return { isLoggedIn: true };
            } else {
                handleServerAppError(dispatch, res.data, false);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.setAppInitialized({ isInitialized: true }))
        }
    }
)
export const login = createAppAsyncThunk<
    { isLoggedIn: boolean },
    { data: LoginParamsType }
>(
    `${slice.name}/login`,
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        try {
            dispatch(appActions.setAppStatus({ status: STATUS_CODE.loading }))
            const res = await authAPI.login(arg.data)

            if (res.data.resultCode === ResultCode.success) {
                dispatch(appActions.setAppStatus({ status: STATUS_CODE.succeeded }))
                return { isLoggedIn: true };
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(null)
        }
    }
)
export const logout = createAppAsyncThunk<
    { isLoggedIn: boolean },
    void
>(
    `${slice.name}/logout`,
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        try {
            dispatch(appActions.setAppStatus({ status: STATUS_CODE.loading }))
            const res = await authAPI.logout()

            if (res.data.resultCode === ResultCode.success) {
                dispatch(appActions.setAppStatus({ status: STATUS_CODE.succeeded }))
                return { isLoggedIn: false };
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(null)
        }
    }
)

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunk = { me, login, logout };
export const { selectorAuthIsLoggedIn } = slice.selectors
