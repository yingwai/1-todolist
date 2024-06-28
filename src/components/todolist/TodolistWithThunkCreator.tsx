import React, { memo, useCallback, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { useAppDisspatch } from "../../state/store";
import { TaskStatuses, TaskType } from "../../api/todolist-api";
import { RequestStatusType, STATUS_CODE } from "../../state/app-reducer";
import { EditableSpanText } from "../EditableSpanText";
import { AddItemForm } from "../AddItemForm";
import { Task } from "../Task/Task";
import { FilterValueType } from "pages/Todolist/Todolist";
import { getTasksTC } from "state/tasksSlice";

type TodoListPropsType = {
    todolistId: string;
    todolistTitle: string;
    tasks: TaskType[];
    filter: FilterValueType;
    entityStatus?: RequestStatusType;
    removeTodolist: (todolistId: string) => void;
    updateTitleTodolist: (todolistId: string, newTitle: string) => void;
    addTask: (todolistId: string, taskTitle: string) => void;
    removeTask: (todolistId: string, taskId: string) => void;
    updateTitleTask: (todolistId: string, taskId: string, newTitle: string) => void;
    changeTaskChekedValue: (todolistId: string, taskId: string, status: TaskStatuses) => void;
    changeFilterValue: (todolistId: string, value: FilterValueType) => void;
};

export const TodolistWithThunkCreator = memo(
    ({
        todolistId,
        todolistTitle,
        tasks,
        filter,
        entityStatus,
        removeTodolist,
        updateTitleTodolist,
        addTask,
        removeTask,
        updateTitleTask,
        changeTaskChekedValue,
        changeFilterValue,
    }: TodoListPropsType) => {
        const dispatch = useAppDisspatch();

        useEffect(() => {
            dispatch(getTasksTC(todolistId));
        }, [dispatch, todolistId]);

        let currentTasks = tasks;
        

        if (filter === "active") {            
            currentTasks = tasks.filter((task) => !task.status);
        }
        if (filter === "completed") {
            currentTasks = tasks.filter((task) => task.status);
        }

        const fUpdateTitleTodolist = useCallback(
            (newTitle: string) => {
                updateTitleTodolist(todolistId, newTitle);
            },
            [todolistId, updateTitleTodolist],
        );

        const fAddTaskHandler = useCallback(
            (title: string) => {
                addTask(todolistId, title);
            },
            [addTask, todolistId],
        );

        const fChangeFilterValueHandler = useCallback(
            (value: FilterValueType) => {
                changeFilterValue(todolistId, value);
            },
            [changeFilterValue, todolistId],
        );

        return (
            <div>
                <div className='todolist-title'>
                    <h3>
                        <EditableSpanText
                            oldTitle={todolistTitle}
                            updateTitleItem={fUpdateTitleTodolist}
                            disabled={entityStatus === STATUS_CODE.loading}
                        />
                    </h3>
                    <IconButton
                        aria-label='delete'
                        onClick={() => removeTodolist(todolistId)}
                        disabled={entityStatus === STATUS_CODE.loading}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
                <AddItemForm addItem={fAddTaskHandler} disabled={entityStatus === STATUS_CODE.loading} />

                {currentTasks?.length === 0 ? (
                    <p>Тасок нет</p>
                ) : (
                    <List>
                        {currentTasks?.map((task) => {
                            return (
                                <Task
                                    key={task.id}
                                    task={task}
                                    todolistId={todolistId}
                                    entityStatus={entityStatus}
                                    updateTitleTask={updateTitleTask}
                                    removeTask={removeTask}
                                    changeTaskChekedValue={changeTaskChekedValue}
                                />
                            );
                        })}
                    </List>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Button
                        variant={filter === "all" ? "contained" : "outlined"}
                        color='success'
                        onClick={() => fChangeFilterValueHandler("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "active" ? "contained" : "outlined"}
                        color={"primary"}
                        onClick={() => fChangeFilterValueHandler("active")}
                    >
                        Active
                    </Button>
                    <Button
                        variant={filter === "completed" ? "contained" : "outlined"}
                        color={"secondary"}
                        onClick={() => fChangeFilterValueHandler("completed")}
                    >
                        Completed
                    </Button>
                </Box>
            </div>
        );
    },
);
