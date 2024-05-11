import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import React, { ChangeEvent, memo, useCallback } from 'react';
import { EditableSpanText } from '../EditableSpanText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { TasksType } from '../../App';

type TaskPropsType = {
    todolistId: string
    task: TasksType
    removeTask: (todolistId: string, taskId: string) => void,
    updateTitleTask: (todolistId: string, taskId: string, newTitle: string) => void
    changeTaskChekedValue: (todolistId: string, taskId: string, taskValue: boolean) => void,
}

export const Task = memo(({ todolistId, task, removeTask, updateTitleTask, changeTaskChekedValue }: TaskPropsType) => {    
    const fUpdateTitleTask = useCallback((taskId: string, newTitle: string) => {
        updateTitleTask(todolistId, taskId, newTitle);
    }, [todolistId, updateTitleTask])
    
    function fRemoveTaskHandler() {
        removeTask(todolistId, task.id)
    }

    function fChangeTaskChekedValue(e: ChangeEvent<HTMLInputElement>) {
        changeTaskChekedValue(todolistId, task.id, e.currentTarget.checked);
    }

    return (
        <ListItem
            sx={{ p: '0', justifyContent: 'space-between', opacity: task.isDone ? '0.4' : "1" }}
        >
            <div>
                <Checkbox checked={task.isDone} onChange={fChangeTaskChekedValue} />
                <EditableSpanText oldTitle={task.title} updateTitleItem={(newTitle: string) => fUpdateTitleTask(task.id, newTitle)} />
            </div>
            <IconButton aria-label="delete" onClick={fRemoveTaskHandler}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
});