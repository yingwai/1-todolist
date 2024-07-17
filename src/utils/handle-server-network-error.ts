import axios from "axios";
import { STATUS_CODE } from "state/app-reducer";
import { appActions } from "state/appSlice";
import { AppThunkDispatch } from "state/store";

export const handleServerNetworkError = (dispatch: AppThunkDispatch, err: unknown): void => {
    let errorMessage = "Some error occurred";

    if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err?.message || errorMessage;
    } else if (err instanceof Error) {
        errorMessage = `Native error: ${err.message}`;
    } else {
        errorMessage = JSON.stringify(err);
    }

    dispatch(appActions.setAppError({ error: errorMessage }));
    dispatch(appActions.setAppStatus({ status: STATUS_CODE.failed }));
};

// export const handleServerNetworkError = (dispatch: Dispatch, error: { message: string }) => {
//     // dispatch(setAppErrorAC(error.message));
//     // dispatch(setAppStatusAC(STATUS_CODE.failed));
//     dispatch(appActions.setAppError({error: error.message}))
//     dispatch(appActions.setAppStatus({status: STATUS_CODE.failed}))
// };