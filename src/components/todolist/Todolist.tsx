import React from 'react';
import { FilterValueType, TasksType } from '../../App';
import { Button } from '../button/Button';

type TodoListPropsType = {
    title: string,
    tasks: TasksType[],
    removeTask: (taskId: number) => void,
    changeFilterValue: (value: FilterValueType) => void;
}



export const Todolist = ({ title, tasks, removeTask, changeFilterValue }: TodoListPropsType) => {
    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input />
                <Button title={"+"} />
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