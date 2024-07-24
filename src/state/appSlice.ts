import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusType } from "./app-reducer";
const slice = createSlice({
    name: "app",
    initialState: {
        isInitialized: false,
        status: "succeeded" as RequestStatusType,
        error: null as string | null,
    },
    reducers: {
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
        // setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
        //     state.status = action.payload.status
        // },
        setAppError: (state, action: PayloadAction<{ error: null | string }>) => {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder
            .addMatcher(
                isPending,
                (state, action) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                isRejected,
                (state, action) => {
                    state.status = 'failed'
                }
            )
            .addMatcher(
                isFulfilled,
                (state, action) => {
                    state.status = 'succeeded'
                }
            )
    },
    selectors: {
        selectorAppInitialized: state => state.isInitialized,
        selectorAppStatus: state => state.status,
        selectorAppError: state => state.error,
    }
})

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const { selectorAppInitialized, selectorAppStatus, selectorAppError } = slice.selectors;
