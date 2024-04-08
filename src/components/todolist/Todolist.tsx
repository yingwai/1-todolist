import React, { ChangeEvent } from 'react';
import { FilterValueType, TasksType } from '../../App';
import { Button } from '../button/Button';
import { AddItemForm } from '../AddItemForm';
import { EditableSpanText } from '../EditableSpanText';

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
                <Button
                    title={"x"}
                    onClick={() => removeTodolist(todolistId)}
                />
            </div>
            <AddItemForm addItem={fAddTaskHandler} />

            {currentTask.length === 0 ?
                <p>Тасок нет</p> :
                <ul>
                    {currentTask.map(task => {
                        function fRemoveTaskHandler() {
                            removeTask(todolistId, task.id)
                        }

                        function fChangeTaskChekedValue(e: ChangeEvent<HTMLInputElement>) {
                            changeTaskChekedValue(todolistId, task.id, e.currentTarget.checked);
                        }

                        return (
                            <li key={task.id} className={task.isDone ? "task-isDone" : ""}>
                                <input type="checkbox" checked={task.isDone} onChange={fChangeTaskChekedValue} />
                                <EditableSpanText oldTitle={task.title} updateTitleItem={(newTitle: string) => fUpdateTitleTask(task.id, newTitle)} />
                                <Button title={"x"} onClick={fRemoveTaskHandler} />
                            </li>
                        )
                    })}
                </ul>
            }

            <div>
                <Button
                    className={filter === "all" ? "tab-btn active-tab-btn" : "tab-btn"}
                    title={"All"}
                    onClick={() => fChangeFilterValueHandler("all")}
                />
                <Button
                    className={filter === "active" ? "tab-btn active-tab-btn" : "tab-btn"}
                    title={"Active"}
                    onClick={() => fChangeFilterValueHandler("active")}
                />
                <Button
                    className={filter === "completed" ? "tab-btn active-tab-btn" : "tab-btn"}
                    title={"Completed"}
                    onClick={() => fChangeFilterValueHandler("completed")}
                />
            </div>
        </div>
    );
};