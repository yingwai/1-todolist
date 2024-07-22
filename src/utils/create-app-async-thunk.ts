import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseType } from "api/todolist-api"
import { AppRootStateType, AppThunkDispatch } from "state/store"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppThunkDispatch
    rejectValue: null | ResponseType
}>()