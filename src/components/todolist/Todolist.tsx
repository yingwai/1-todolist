import React, { ChangeEvent, useState } from 'react';
import { FilterValueType, TasksType } from '../../App';
import { Button } from '../button/Button';

type TodoListPropsType = {
    todolistId: string,
    title: string,
    tasks: TasksType[],
    filter: FilterValueType,
    removeTodolist: (todolistId: string) => void,
    addTask: (todolistId: string, taskTitle: string) => void,
    removeTask: (todolistId: string, taskId: string) => void,
    changeTaskChekedValue: (todolistId: string, taskId: string, taskValue: boolean) => void,
    changeFilterValue: (todolistId: string, value: FilterValueType) => void
}

export const Todolist = ({ todolistId, title, tasks, filter, removeTodolist, addTask, removeTask, changeTaskChekedValue, changeFilterValue }: TodoListPropsType) => {
    let currentTask = tasks;
    if (filter === "active") currentTask = tasks.filter(task => !task.isDone);
    if (filter === "completed") currentTask = tasks.filter(task => task.isDone);

    let [taskTitle, setTaskTitle] = useState<string>('');
    let [errorInput, setErrorInput] = useState<string | null>(null);

    const nMinLimitValueTitle = 5;

    function fAddTask() {
        if (taskTitle.length < nMinLimitValueTitle) return;

        if (taskTitle.trim() === "") return (setErrorInput("Title is required"), setTaskTitle(""));

        addTask(todolistId, taskTitle.trim());
        setTaskTitle("");
    }

    function fTaskOnKeyUpHandler(e: any) {
        setErrorInput(null);

        if (e.key === "Enter") fAddTask();
    }

    function fChangeFilterValueHandler(value: FilterValueType) {
        changeFilterValue(todolistId, value);
    }

    return (
        <div>
            <div className='todolist-title'>
                <h3>{title}</h3>
                <Button
                    title={"x"}
                    onClick={() => removeTodolist(todolistId)}
                />
            </div>
            <div>
                <input
                    value={taskTitle}
                    className={errorInput ? "errorInput" : ""}
                    onChange={e => setTaskTitle(e.currentTarget.value)}
                    onKeyUp={e => fTaskOnKeyUpHandler(e)}
                />
                <Button
                    title={"+"}
                    onClick={() => fAddTask()}
                    disabled={taskTitle.length < nMinLimitValueTitle}
                />
                {errorInput && <div className={errorInput ? "errorInputMessage" : ""}>{errorInput}</div>}
            </div>

            {currentTask.length === 0 ?
                <p>Тасок нет</p> :
                <ul>
                    {currentTask.map(task => {
                        function fChangeTaskChekedValue(e: ChangeEvent<HTMLInputElement>) {
                            changeTaskChekedValue(todolistId, task.id, e.currentTarget.checked);
                        }

                        return (
                            <li key={task.id} className={task.isDone ? "task-isDone" : ""}>
                                <input type="checkbox" checked={task.isDone} onChange={fChangeTaskChekedValue} />
                                <span>{task.title}</span>
                                <Button title={"x"} onClick={() => removeTask(todolistId, task.id)} />
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