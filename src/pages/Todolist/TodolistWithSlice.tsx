import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect } from "react";
import { AddItemForm } from "../../components/AddItemForm";
import Paper from "@mui/material/Paper";
import { TodolistWithThunkCreator } from "../../components/Todolist/TodolistWithThunkCreator";
import { TaskStatuses, TaskType } from "../../api/todolist-api";
import { RequestStatusType } from "../../state/app-reducer";
import { useSelector } from "react-redux";
import { useAppDisspatch } from "../../state/store";
import { Navigate } from "react-router-dom";
import { createTodolistsTC, deleteTodolistsTC, getTodolistsTC, selectTodolists, updateTodolistsTC } from "state/todolistsSlice";
import { selectorAuthIsLoggedIn } from "pages/Login/authSlice";
import { addTaskTC, removeTaskTC, selectorTasks, tasksActions, updateTaskStatusTC, updateTaskTitleTC } from "state/tasksSlice";
import { changeTaskFilterAC } from "state/tasks-reducer";

export type TodolistType = {
    id: string;
    title: string;
};

export type TasksStateType = {
    [key: string]: TaskInStateType;
};

export type TaskInStateType = {
    data: TaskType[];
    filter: FilterValueType;
    entityStatus: RequestStatusType;
};

export type FilterValueType = "all" | "active" | "completed";

const TodolistWithSlice = () => {
    const isLoggedIn = useSelector(selectorAuthIsLoggedIn);
    const todolists = useSelector(selectTodolists);
    const tasks = useSelector(selectorTasks);
    const dispatch = useAppDisspatch();

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        dispatch(getTodolistsTC());
    }, [dispatch, isLoggedIn]);

    const fAddTodolist = useCallback(
        (tdlTitle: string) => {
            dispatch(createTodolistsTC(tdlTitle));
        },
        [dispatch],
    );

    const fRemoveTodolist = useCallback(
        (todolistId: string) => {
            dispatch(deleteTodolistsTC(todolistId));
        },
        [dispatch],
    );

    const fUpdateTitleTodolist = useCallback(
        (todolistId: string, newTitle: string) => {
            dispatch(updateTodolistsTC(todolistId, newTitle));
        },
        [dispatch],
    );

    const fAddTask = useCallback(
        (todolistId: string, taskTitle: string) => {
            dispatch(addTaskTC(todolistId, taskTitle));
        },
        [dispatch],
    );

    const fRemoveTask = useCallback(
        (todolistId: string, taskId: string) => {
            dispatch(removeTaskTC(todolistId, taskId));
        },
        [dispatch],
    );

    const fChangeTaskChekedValue = useCallback(
        (todolistId: string, taskId: string, status: TaskStatuses) => {
            dispatch(updateTaskStatusTC(todolistId, taskId, status));
        },
        [dispatch],
    );

    const fUpdateTitleTask = useCallback(
        (todolistId: string, taskId: string, newTitle: string) => {
            dispatch(updateTaskTitleTC(todolistId, taskId, newTitle));
        },
        [dispatch],
    );

    const fChangeFilterValue = useCallback(
        (todolistId: string, value: FilterValueType) => {
            dispatch(tasksActions.changeTaskFilter({ todolistId, filter: value }))
        },
        [dispatch],
    );

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />;
    }

    return (
        <>
            <Grid container sx={{ my: "30px" }}>
                <AddItemForm addItem={fAddTodolist} />
            </Grid>

            <Grid container spacing={4}>
                {todolists?.map((tl) => {
                    return (
                        <Grid item key={tl.id}>
                            <Paper elevation={4} sx={{ p: "0 15px 15px 15px" }}>
                                <TodolistWithThunkCreator
                                    key={tl.id}
                                    todolistId={tl.id}
                                    todolistTitle={tl.title}
                                    tasks={tasks[tl.id].data}
                                    filter={tasks[tl.id].filter}
                                    entityStatus={tasks[tl.id].entityStatus}
                                    removeTodolist={fRemoveTodolist}
                                    addTask={fAddTask}
                                    removeTask={fRemoveTask}
                                    changeTaskChekedValue={fChangeTaskChekedValue}
                                    changeFilterValue={fChangeFilterValue}
                                    updateTitleTask={fUpdateTitleTask}
                                    updateTitleTodolist={fUpdateTitleTodolist}
                                />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};

export default TodolistWithSlice;
