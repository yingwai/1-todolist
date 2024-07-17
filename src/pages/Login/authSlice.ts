import { Dispatch } from "redux";
import {
    STATUS_CODE,
} from "../../state/app-reducer";
import { authAPI, ResultCode } from "../../api/todolist-api";
import { handleServerAppError } from "../../utils/handle-server-app-error";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "state/appSlice";
import { AppThunk } from "state/store";
import { handleServerNetworkError } from "utils/handle-server-network-error";

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {            
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    selectors: {
        selectorAuthIsLoggedIn: state => state.isLoggedIn
    }
})

// thunks
export const meTC = (): AppThunk => (dispatch) => {
    authAPI
        .me()
        .then((res) => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
            } else {
                console.log(res.data);
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error);
        })
        .finally(() => {
            dispatch(appActions.setAppInitialized({ isInitialized: true }))
        });
};

export const loginTC = (data: any): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({ status: STATUS_CODE.loading }))
    authAPI
        .login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
                dispatch(appActions.setAppStatus({ status: STATUS_CODE.succeeded }))
            } else {
                handleServerAppError(dispatch, res.data);
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error);
        });
};

export const logoutTC = (): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: STATUS_CODE.loading }))
    authAPI
        .logout()
        .then((res) => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
                dispatch(appActions.setAppStatus({ status: STATUS_CODE.succeeded }))
            } else {
                handleServerAppError(dispatch, res.data);
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error);
        });
};

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const { selectorAuthIsLoggedIn } = slice.selectors
