import { authAPI, LoginParamsType, ResultCode } from "../../api/todolist-api";
import { handleServerAppError } from "../../utils/handle-server-app-error";
import { createSlice, isFulfilled } from "@reduxjs/toolkit";
import { appActions } from "state/appSlice";
import { createAppAsyncThunk, thunkTryCatch } from "utils";

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addMatcher(
                isFulfilled(me, login, logout),
                (state, action) => {
                    state.isLoggedIn = action.payload.isLoggedIn;
                }
            );

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

        return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.me()

            if (res.data.resultCode === ResultCode.success) {
                return { isLoggedIn: true };
            } else {
                handleServerAppError(dispatch, res.data, false);
                return rejectWithValue(null)
            }
        }).finally(() => {
            dispatch(appActions.setAppInitialized({ isInitialized: true }))
        })
    }
)
export const login = createAppAsyncThunk<
    { isLoggedIn: boolean },
    { data: LoginParamsType }
>(
    `${slice.name}/login`,
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.login(arg.data)

            if (res.data.resultCode === ResultCode.success) {
                return { isLoggedIn: true };
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        })
    }
)
export const logout = createAppAsyncThunk<
    { isLoggedIn: boolean },
    void
>(
    `${slice.name}/logout`,
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.logout()

            if (res.data.resultCode === ResultCode.success) {
                return { isLoggedIn: false };
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        })
    }
)

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunk = { me, login, logout };
export const { selectorAuthIsLoggedIn } = slice.selectors
