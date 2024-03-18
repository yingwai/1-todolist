import React, { useState } from 'react';
import './App.css';
import { Todolist } from './components/todolist/Todolist';

export type TasksType = {
    id: number,
    title: string,
    isDone: boolean
}

export type FilterValueType = 'all' | 'active' | 'completed';

function App() {
    const [tasks, setTasks] = useState<TasksType[]>([
        { id: 0, title: "HTML&CSS", isDone: true },
        { id: 1, title: "JS", isDone: false },
        { id: 2, title: "React", isDone: false },
    ]);

    const [filter, setFilter] = useState<FilterValueType>("all");

    let currentTask = tasks;
    if (filter === "active") currentTask = tasks.filter(task => !task.isDone);
    if (filter === "completed") currentTask = tasks.filter(task => task.isDone);

    // UI
    function fRemoveTask(taskId: number) {
        const filterTasks = tasks.filter(task => {return task.id !== taskId})
        setTasks(filterTasks);
    }

    function fChangeFilterValue(value: FilterValueType) {
        setFilter(value);
    }

    return (
        <div className="App">
            <Todolist title={"My Todolist"} tasks={currentTask} removeTask={fRemoveTask} changeFilterValue={fChangeFilterValue} />
        </div>
    );
}

export default App;
