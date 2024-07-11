import { TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType } from "../api/todolist-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "./store";
import { RequestStatusType, STATUS_CODE } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { FilterValueType, TasksStateType } from "../pages/Todolist/Todolist";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "./todolistsSlice";
import { appActions } from "./appSlice";
import { authActions } from "pages/Login/authSlice";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";

const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateType,
    reducers: {
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].data.unshift(action.payload.task)
        },
        removeTask: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const task = state[action.payload.todolistId].data;
            const index = task.findIndex(el => el.id === action.payload.taskId)
            if (index !== -1) task.splice(index, 1)
        },
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
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = {
                        data: [],
                        filter: 'all',
                        entityStatus: STATUS_CODE.idle
                    }
                })
            })
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = {
                    data: [],
                    filter: "all",
                    entityStatus: STATUS_CODE.idle
                }
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(authActions.setIsLoggedIn, (state, action) => {
                if (!action.payload.isLoggedIn) return {};
            })
            .addCase(getTask.fulfilled, (state, action) => {
                state[action.payload.todolistId].data = action.payload.tasks;
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
    async (todolistId: string, thunkAPI) => {
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

        } catch (error: any) {
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(null)
        }
    }
)

export const AddTask = createAppAsyncThunk(
    `${slice.name}`,
    async () => {
        
    }
)
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI
        .createTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(tasksActions.addTask({ task: res.data.data.item }))
            } else {
                handleServerAppError(dispatch, res.data);
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error);
        });
};

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.loading }))
    todolistAPI
        .deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(tasksActions.removeTask({ todolistId, taskId }))
                dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.idle }))
            } else {
                handleServerAppError(dispatch, res.data);
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error);
        });
};

export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.loading }))
        const tasks = getState().tasks;
        const task = tasks[todolistId].data.find((t) => t.id === taskId);

        if (task) {
            const model: UpdateTaskModelType = {
                title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
            };

            todolistAPI
                .updateTask(todolistId, taskId, model)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(tasksActions.changeTaskTitle({ todolistId, taskId, newTitle: title }))
                        dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.idle }))
                    } else {
                        handleServerAppError(dispatch, res.data);
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(dispatch, error);
                });
        }
    };
};

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.loading }))
        const tasks = getState().tasks;
        const task = tasks[todolistId].data.find((t) => t.id === taskId);

        if (task) {
            const model: UpdateTaskModelType = {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status,
            };

            todolistAPI
                .updateTask(todolistId, taskId, model)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(tasksActions.changeTaskStatus({ todolistId, taskId, status }))
                        dispatch(tasksActions.changeTodolistEntityStatus({ id: todolistId, status: STATUS_CODE.idle }))
                    } else {
                        handleServerAppError(dispatch, res.data);
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(dispatch, error);
                });
        }
    };
};

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunk = { getTask }
export const { selectorTasks } = slice.selectors