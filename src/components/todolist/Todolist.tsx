import React, { useState } from 'react';
import { FilterValueType, TasksType } from '../../App';
import { Button } from '../button/Button';

type TodoListPropsType = {
    title: string,
    tasks: TasksType[],
    addTask: (taskTitle: string) => void,
    removeTask: (taskId: string) => void,
    changeFilterValue: (value: FilterValueType) => void;
}



export const Todolist = ({ title, tasks, addTask, removeTask, changeFilterValue }: TodoListPropsType) => {
    const [taskTitle, setTaskTitle] = useState<string>('');

    const nMinLimitValueTitle = 5;

    function fAddTask() {
        if (taskTitle.length < nMinLimitValueTitle) return;

        addTask(taskTitle);
        setTaskTitle("");
    } 

    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input value={taskTitle} onChange={e => setTaskTitle(e.currentTarget.value)} onKeyUp={e => { if (e.key === "Enter") fAddTask()}} />
                <Button title={"+"} onClick={() => fAddTask()} disabled={taskTitle.length < nMinLimitValueTitle} />
            </div>
            {tasks.length === 0 ?
                <p>Тасок нет</p> :
                <ul>
                    {tasks.map(task => {
                        return (
                            <li key={task.id}>
                                <input type="checkbox" checked={task.isDone} /> <span>{task.title}</span>
                                <Button title={"x"} onClick={() => removeTask(task.id)} />
                            </li>
                        )
                    })}
                </ul>
            }
            <div>
                <Button title={"All"} onClick={() => changeFilterValue("all")} />
                <Button title={"Active"} onClick={() => changeFilterValue("active")} />
                <Button title={"Completed"} onClick={() => changeFilterValue("completed")} />
            </div>
        </div>
    );
};