import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "pages/Login/authSlice";
import { appReducer } from "./appSlice";
import { todolistsReducer } from "./todolistsSlice";
import { tasksReducer } from "./tasksSlice";
// import { appReducer } from "./app-reducer";
// import { authReducer } from "../pages/Login/auth-reducer";
// import { tasksReducer } from "./tasks-reducer";

// const rootReducer = combineReducers({
//     tasks: tasksReducer,
//     todolists: todolistsReducer,
//     app: appReducer,
//     auth: authReducer,
// });

// export const store = configureStore({
//     reducer: rootReducer,
// })
export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        todolists: todolistsReducer,
        app: appReducer,
        auth: authReducer,
    },
})

export type AppRootStateType = ReturnType<typeof store.getState>;
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>
// export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>;
export type AppThunkDispatch = typeof store.dispatch

export const useAppDisspatch = () => useDispatch<AppThunkDispatch>();

// @ts-ignore
window.store = store;
