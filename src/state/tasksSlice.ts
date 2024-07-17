import { ResultCode, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType } from "../api/todolist-api";
import { RequestStatusType, STATUS_CODE } from "./app-reducer";
import { FilterValueType, TasksStateType } from "../pages/Todolist/Todolist";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsThunk } from "./todolistsSlice";
import { appActions } from "./appSlice";
import { authActions } from "pages/Login/authSlice";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "utils";

const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateType,
    reducers: {
        changeTaskStatus: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: TaskStatuses }>) => {
            const tasks = state[action.payload.todolistId].data
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index !== -1) tasks[index].status = action.payload.status

        },
        changeTaskTitle: (state, action: PayloadAction<{ todolistId: string, taskId: string, newTitle: string }>) => {
            const tasks = state[action.payload.todolistId].data
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index !== -1) tasks[index].title = action.payload.newTitle

        },
        changeTaskFilter: (state, action: PayloadAction<{ todolistId: string, filter: FilterValueType }>) => {
            state[action.payload.todolistId].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            state[action.payload.id].entityStatus = action.payload.status
        }
    },
    extraReducers: builder => {
        builder
            .addCase(todolistsThunk.getTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = {
                        data: [],
                        filter: 'all',
                        entityStatus: STATUS_CODE.idle
                    }
                })
            })
            .addCase(todolistsThunk.createTodolists.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = {
                    data: [],
                    filter: "all",
                    entityStatus: STATUS_CODE.idle
                }
            })
            .addCase(todolistsThunk.deleteTodolists.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(authActions.setIsLoggedIn, (state, action) => {
                if (!action.payload.isLoggedIn) return {};
            })
            .addCase(getTask.fulfilled, (state, action) => {
                state[action.payload.todolistId].data = action.payload.tasks;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].data.unshift(action.payload.task)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const task = state[action.payload.todolistId].data;
                const index = task.findIndex(el => el.id === action.payload.taskId)
                if (index !== -1) task.splice(index, 1)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId].data
                const index = tasks.findIndex(el => el.id === action.payload.taskId)
                if (index !== -1) {
                    if (action.payload.status) tasks[index].status = action.payload.status
                    if (action.payload.title) tasks[index].title = action.payload.title
                }
            })
    },
    selectors: {
        selectorTasks: state => state
    }
});

// Thunk

export const getTask = createAppAsyncThunk<
    { tasks: TaskType[], todolistId: string },
    string
>(
    `${slice.name}/getTasks`,
    async (todolistId, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        try {
            dispatch(appActions.setAppStatus({ status: STATUS_CODE.loading }))
            const res = await todolistAPI.getTasks(todolistId)

            if (res.data.error === null) {
                dispatch(appActions.setAppStatus({ status: STATUS_CODE.succeeded }))
                return { todolistId, tasks: res.data.items }
            } else {
                handleServerAppError(dispatch, res.data.error)
                return rejectWithValue(null)
            }

        } catch (error) {
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(null)
        }
    }
)
export const addTask = createAppAsyncThunk<
    { task: TaskType },
    { todolistId: string, title: string }
>(
    `${slice.name}/addTask`,
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        try {
            const res = await todolistAPI.createTask(arg)

            if (res.data.resultCode === ResultCode.success) {
                return { task: res.data.data.item }
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(dispatch, error);
            return rejectWithValue(null)
        }

    }
)
export const removeTask = createAppAsyncThunk<
    { todolistId: string, taskId: string },
    { todolistId: string, taskId: string }
>(
    `${slice.name}/removeTask`,
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        try {
            dispatch(tasksActions.changeTodolistEntityStatus({ id: arg.todolistId, status: STATUS_CODE.loading }))

            const res = await todolistAPI.deleteTask(arg)

            if (res.data.resultCode === ResultCode.success) {
                dispatch(tasksActions.changeTodolistEntityStatus({ id: arg.todolistId, status: STATUS_CODE.idle }))
                return { todolistId: arg.todolistId, taskId: arg.taskId }
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(dispatch, error);
            return rejectWithValue(null)
        }

    }
)
export const updateTask = createAppAsyncThunk<
    { todolistId: string, taskId: string, title?: string, status?: TaskStatuses },
    { todolistId: string, taskId: string, title?: string, status?: TaskStatuses }
>(
    `${slice.name}/updateTask`,
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue, getState } = thunkAPI;

        try {
            dispatch(tasksActions.changeTodolistEntityStatus({ id: arg.todolistId, status: STATUS_CODE.loading }))
            const tasks = getState().tasks;
            const task = tasks[arg.todolistId].data.find((t) => t.id === arg.taskId);

            if (!task) {
                handleServerAppError(dispatch, 'Task not found.');
                return rejectWithValue(null)
            }

            const model: UpdateTaskModelType = {
                title: arg?.title || task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: arg?.status || task.status,
            };            

            const res = await todolistAPI.updateTask({ todolistId: arg.todolistId, taskId: arg.taskId, model })

            if (res.data.resultCode === ResultCode.success) {
                dispatch(tasksActions.changeTodolistEntityStatus({ id: arg.todolistId, status: STATUS_CODE.idle }))

                return { todolistId: arg.todolistId, taskId: arg.taskId, title: arg?.title, status: arg?.status }
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(dispatch, error);
            return rejectWithValue(null)
        }

    }
)

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunk = { getTask, addTask, removeTask, updateTask }
export const { selectorTasks } = slice.selectors