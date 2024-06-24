export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null,
    isInitialized: false
}

export enum STATUS_CODE {
    idle = 'idle',
    loading = 'loading',
    succeeded = 'succeeded',
    failed = 'failed'
}

type InitialStateType = {
    status: RequestStatusType
    error: null | string
    isInitialized: boolean
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.payload.status }
        case "APP/SET-ERROR":
            return { ...state, error: action.payload.error }
        case "APP/SET-INIT":
            return { ...state, isInitialized: action.payload.isInitialized }
        default:
            return state
    }
}

type ActionsType = SetAppStatusActionType
    | SetAppErrorActionType
    | SetAppInitializedActionType

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>

export const setAppStatusAC = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', payload: { status } } as const)
export const setAppErrorAC = (error: string | null) => ({ type: 'APP/SET-ERROR', payload: { error } } as const)
export const setAppInitializedAC = (isInitialized: boolean) => ({ type: 'APP/SET-INIT', payload: { isInitialized } } as const)