import { Dispatch } from "redux";
import {
    SetAppErrorActionType,
    setAppInitializedAC,
    setAppStatusAC,
    SetAppStatusActionType,
    STATUS_CODE,
} from "../../state/app-reducer";
import { authAPI, ResultCode } from "../../api/todolist-api";
import { handleServerAppError } from "../../utils/handle-server-app-error";
import { handleServerNetworkError } from "utils/handle-server-network-error";

const initialState = {
    isLoggedIn: false,
};
type InitialStateType = typeof initialState;

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN":
            return { ...state, isLoggedIn: action.value };
        default:
            return state;
    }
};

// actions
export const setIsLoggedInAC = (value: boolean) => ({ type: "login/SET-IS-LOGGED-IN", value }) as const;

// thunks
export const meTC = () => (dispatch: Dispatch) => {
    authAPI
        .me()
        .then((res) => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(setIsLoggedInAC(true));
            } else {
                console.log(res.data);
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error);
        })
        .finally(() => {
            dispatch(setAppInitializedAC(true));
        });
};

export const loginTC = (data: any) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC(STATUS_CODE.loading));
    authAPI
        .login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC(STATUS_CODE.succeeded));
            } else {
                handleServerAppError(dispatch, res.data);
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error);
        });
};

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC(STATUS_CODE.loading));
    authAPI
        .logout()
        .then((res) => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(setIsLoggedInAC(false));
                dispatch(setAppStatusAC(STATUS_CODE.succeeded));
            } else {
                handleServerAppError(dispatch, res.data);
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error);
        });
};

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType;
