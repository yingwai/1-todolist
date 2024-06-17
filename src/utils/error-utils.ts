
import { Dispatch } from 'redux'
import { setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType, STATUS_CODE } from '../state/app-reducer'
import { ResponseType } from '../api/todolist-api'

type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetAppStatusActionType>

// generic function
export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T> | string) => {
    if (typeof data === 'string') {
        dispatch(setAppErrorAC(data))
    } else if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC(STATUS_CODE.failed))
}

export const handleServerNetworkError = (dispatch: ErrorUtilsDispatchType, error: { message: string },) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC(STATUS_CODE.failed))
}