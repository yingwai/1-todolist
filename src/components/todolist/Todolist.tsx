import React, { ChangeEvent, useState } from 'react';
import { FilterValueType, TasksType } from '../../App';
import { Button } from '../button/Button';

type TodoListPropsType = {
    title: string,
    tasks: TasksType[],
    filter: FilterValueType,
    addTask: (taskTitle: string) => void,
    removeTask: (taskId: string) => void,
    changeTaskChekedValue: (taskId: string, taskValue: boolean) => void,
    changeFilterValue: (value: FilterValueType) => void
}



export const Todolist = ({ title, tasks, filter, addTask, removeTask, changeTaskChekedValue, changeFilterValue }: TodoListPropsType) => {
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [errorInput, setErrorInput] = useState<string | null>(null);

    const nMinLimitValueTitle = 5;

    function fAddTask() {
        if (taskTitle.length < nMinLimitValueTitle) return;

        if (taskTitle.trim() === "") return (setErrorInput("Title is required"), setTaskTitle(""));

        addTask(taskTitle.trim());
        setTaskTitle("");
    }

    function fTaskOnKeyUpHandler(e: any) {
        setErrorInput(null);

        if (e.key === "Enter") fAddTask();
    }

    return (
        <div>
            <h3>{title}</h3>
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

            {tasks.length === 0 ?
                <p>Тасок нет</p> :
                <ul>
                    {tasks.map(task => {
                        function fChangeTaskChekedValue(e: ChangeEvent<HTMLInputElement>) {
                            changeTaskChekedValue(task.id, e.currentTarget.checked);
                        }

                        return (
                            <li key={task.id} className={task.isDone ? "task-isDone" : ""}>
                                <input type="checkbox" checked={task.isDone} onChange={fChangeTaskChekedValue} />
                                <span>{task.title}</span>
                                <Button title={"x"} onClick={() => removeTask(task.id)} />
                            </li>
                        )
                    })}
                </ul>
            }

            <div>
                <Button className={filter === "all" ? "tab-btn active-tab-btn" : "tab-btn"} title={"All"} onClick={() => changeFilterValue("all")} />
                <Button className={filter === "active" ? "tab-btn active-tab-btn" : "tab-btn"} title={"Active"} onClick={() => changeFilterValue("active")} />
                <Button className={filter === "completed" ? "tab-btn active-tab-btn" : "tab-btn"} title={"Completed"} onClick={() => changeFilterValue("completed")} />
            </div>
        </div>
    );
};