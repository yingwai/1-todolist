import {
    STATUS_CODE,
} from "../state/app-reducer";
import { ResponseType } from "../api/todolist-api";
import { appActions } from "state/appSlice";
import { AppThunkDispatch } from "state/store";

// generic function
export const handleServerAppError = <T>(dispatch: AppThunkDispatch, data: ResponseType<T> | string) => {
    if (typeof data === "string") {
        // dispatch(setAppErrorAC(data));
        dispatch(appActions.setAppError({ error: data }))
    } else if (data.messages.length) {
        // dispatch(setAppErrorAC(data.messages[0]));
        dispatch(appActions.setAppError({ error: data.messages[0] }))
    } else {
        // dispatch(setAppErrorAC("Some error occurred"));
        dispatch(appActions.setAppError({ error: "Some error occurred" }))
    }
    // dispatch(setAppStatusAC(STATUS_CODE.failed));
    dispatch(appActions.setAppStatus({ status: STATUS_CODE.failed }))
};
