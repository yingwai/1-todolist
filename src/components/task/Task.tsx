import Checkbox from "@mui/material/Checkbox";
import ListItem from "@mui/material/ListItem";
import React, { ChangeEvent, memo, useCallback } from "react";
import { EditableSpanText } from "../EditableSpanText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskStatuses, TaskType } from "../../api/todolist-api";
import { RequestStatusType, STATUS_CODE } from "../../state/app-reducer";

type TaskPropsType = {
    todolistId: string;
    task: TaskType;
    entityStatus?: RequestStatusType;
    removeTask: (todolistId: string, taskId: string) => void;
    updateTitleTask: (todolistId: string, taskId: string, newTitle: string) => void;
    changeTaskChekedValue: (todolistId: string, taskId: string, status: TaskStatuses) => void;
};

export const Task = memo(
    ({ todolistId, task, entityStatus, removeTask, updateTitleTask, changeTaskChekedValue }: TaskPropsType) => {
        const fUpdateTitleTask = useCallback(
            (taskId: string, newTitle: string) => {
                updateTitleTask(todolistId, taskId, newTitle);
            },
            [todolistId, updateTitleTask],
        );

        function fRemoveTaskHandler() {
            removeTask(todolistId, task.id);
        }

        function fChangeTaskChekedValue(e: ChangeEvent<HTMLInputElement>) {
            const value = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.InProgress;

            changeTaskChekedValue(todolistId, task.id, value);
        }

        return (
            <ListItem
                sx={{
                    p: "0",
                    justifyContent: "space-between",
                    opacity: task.status === TaskStatuses.Completed ? "0.4" : "1",
                }}
            >
                <div>
                    <Checkbox
                        checked={task.status === TaskStatuses.Completed}
                        onChange={fChangeTaskChekedValue}
                        disabled={entityStatus === STATUS_CODE.loading}
                    />
                    <EditableSpanText
                        oldTitle={task.title}
                        updateTitleItem={(newTitle: string) => fUpdateTitleTask(task.id, newTitle)}
                        disabled={entityStatus === STATUS_CODE.loading}
                    />
                </div>
                <IconButton
                    aria-label='delete'
                    onClick={fRemoveTaskHandler}
                    disabled={entityStatus === STATUS_CODE.loading}
                >
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        );
    },
);
