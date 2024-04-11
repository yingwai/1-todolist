import React, { ChangeEvent } from 'react';
import { FilterValueType, TasksType } from '../../App';
// import { Button } from '../button/Button';
import { AddItemForm } from '../AddItemForm';
import { EditableSpanText } from '../EditableSpanText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';

type TodoListPropsType = {
    todolistId: string,
    todolistTitle: string,
    tasks: TasksType[],
    filter: FilterValueType,
    removeTodolist: (todolistId: string) => void,
    updateTitleTodolist: (todolistId: string, newTitle: string) => void
    addTask: (todolistId: string, taskTitle: string) => void,
    removeTask: (todolistId: string, taskId: string) => void,
    updateTitleTask: (todolistId: string, taskId: string, newTitle: string) => void
    changeTaskChekedValue: (todolistId: string, taskId: string, taskValue: boolean) => void,
    changeFilterValue: (todolistId: string, value: FilterValueType) => void,
}

export const Todolist = (
    { todolistId, todolistTitle, tasks, filter, removeTodolist, updateTitleTodolist, addTask, removeTask, updateTitleTask, changeTaskChekedValue, changeFilterValue }: TodoListPropsType
) => {
    let currentTask = tasks;
    if (filter === "active") currentTask = tasks.filter(task => !task.isDone);
    if (filter === "completed") currentTask = tasks.filter(task => task.isDone);

    function fUpdateTitleTodolist(newTitle: string) {
        updateTitleTodolist(todolistId, newTitle);
    }

    function fAddTaskHandler(title: string) {
        addTask(todolistId, title)
    }

    function fUpdateTitleTask(taskId: string, newTitle: string) {
        updateTitleTask(todolistId, taskId, newTitle);
    }

    function fChangeFilterValueHandler(value: FilterValueType) {
        changeFilterValue(todolistId, value);
    }

    return (
        <div>
            <div className='todolist-title'>
                <h3>
                    <EditableSpanText oldTitle={todolistTitle} updateTitleItem={fUpdateTitleTodolist} />
                </h3>
                <IconButton aria-label="delete" onClick={() => removeTodolist(todolistId)}>
                    <DeleteIcon />
                </IconButton>
            </div>
            <AddItemForm addItem={fAddTaskHandler} />

            {
                currentTask.length === 0 ?
                    <p>Тасок нет</p> :
                    <List>
                        {currentTask.map(task => {
                            function fRemoveTaskHandler() {
                                removeTask(todolistId, task.id)
                            }

                            function fChangeTaskChekedValue(e: ChangeEvent<HTMLInputElement>) {
                                changeTaskChekedValue(todolistId, task.id, e.currentTarget.checked);
                            }

                            return (
                                <ListItem
                                    key={task.id}
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
                            )
                        })}
                    </List>
            }

            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: '8px'}}>
                <Button
                    variant={filter === 'all' ? 'contained' : 'outlined'}
                    color='success'
                    onClick={() => fChangeFilterValueHandler("all")}
                >
                    All
                </Button>
                <Button
                    variant={filter === 'active' ? 'contained' : 'outlined'}
                    color={'primary'}
                    onClick={() => fChangeFilterValueHandler("active")}
                >
                    Active
                </Button>
                <Button
                    variant={filter === 'completed' ? 'contained' : 'outlined'}
                    color={'secondary'}
                    onClick={() => fChangeFilterValueHandler("completed")}
                >
                    Completed
                </Button>
            </Box>
        </div >
    );
};