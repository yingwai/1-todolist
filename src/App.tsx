import React, { useState } from 'react';
import './App.css';
import { Todolist } from './components/todolist/Todolist';
import { v1 } from 'uuid';

export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FilterValueType = 'all' | 'active' | 'completed';

function App() {
    const [tasks, setTasks] = useState<TasksType[]>([
        { id: v1(), title: "HTML&CSS", isDone: true },
        { id: v1(), title: "JS", isDone: false },
        { id: v1(), title: "React", isDone: false },
    ]);

    const [filter, setFilter] = useState<FilterValueType>("all");

    let currentTask = tasks;
    if (filter === "active") currentTask = tasks.filter(task => !task.isDone);
    if (filter === "completed") currentTask = tasks.filter(task => task.isDone);

    function fAddTask(taskTitle: string) {
        const newTask = {
            id: v1(),
            title: taskTitle, 
            isDone: false
        }

        setTasks([newTask, ...tasks]);
    }

    function fRemoveTask(taskId: string) {
        const filterTasks = tasks.filter(task => { return task.id !== taskId })
        setTasks(filterTasks);
    }

    function fChangeTaskChekedValue(taskId: string, taskValue: boolean) {
        const newTasks = tasks.map(t => (t.id === taskId ? {...t, isDone: taskValue} : t));
        setTasks(newTasks);
    }

    function fChangeFilterValue(value: FilterValueType) {
        setFilter(value);
    }

    return (
        <div className="App">
            <Todolist title={"My Todolist"} tasks={currentTask} filter={filter} addTask={fAddTask} removeTask={fRemoveTask} changeTaskChekedValue={fChangeTaskChekedValue} changeFilterValue={fChangeFilterValue} />
        </div>
    );
}

export default App;
