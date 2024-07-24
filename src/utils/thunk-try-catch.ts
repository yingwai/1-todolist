import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { ResponseType } from "api/todolist-api";
import { AppRootStateType, AppThunkDispatch } from "state/store";
import { handleServerNetworkError } from "./handle-server-network-error";

/**
 * Универсальная функция-обёртка для выполнения асинхронной логики с обработкой ошибок.
 *
 * @param thunkAPI - объект с методами и состоянием для thunk.
 * @param logic - асинхронная функция, которую необходимо выполнить.
 * @returns Результат выполнения асинхронной функции или действие rejectWithValue при ошибке.
 */
export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppThunkDispatch, null | ResponseType>,
    logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI;
    
    // dispatch(appActions.setAppStatus({ status: STATUS_CODE.loading }));

    try {
        return await logic();
    } catch (e) {
        handleServerNetworkError(dispatch, e);
        return rejectWithValue(null);
    } finally {
        // dispatch(appActions.setAppStatus({ status: STATUS_CODE.succeeded }));
    }
};