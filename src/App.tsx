import React, { useState } from 'react';
import './App.css';
import { Todolist } from './components/todolist/Todolist';
import { v1 } from 'uuid';

export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}

type TasksStateType = {
    [key: string]: TasksType[]
}

export type FilterValueType = 'all' | 'active' | 'completed';

type TodolistType = {
    id: string
    title: string
    filter: FilterValueType
}

function App() {
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<TodolistType[]>([
        { id: todolistID1, title: 'What to learn', filter: 'all' },
        { id: todolistID2, title: 'What to buy', filter: 'all' },
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            { id: v1(), title: 'HTML&CSS', isDone: true },
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'ReactJS', isDone: false },
        ],
        [todolistID2]: [
            { id: v1(), title: 'Rest API', isDone: true },
            { id: v1(), title: 'GraphQL', isDone: false },
        ],
    })

    function fRemoveTodolist(todolistId: string) {
        setTodolists(todolists.filter(tl => tl.id !== todolistId));
        delete tasks[todolistId];
        setTasks({ ...tasks })
    }

    function fAddTask(todolistId: string, taskTitle: string) {
        const newTask = {
            id: v1(),
            title: taskTitle,
            isDone: false
        }

        setTasks({ ...tasks, [todolistId]: [...tasks[todolistId], newTask] });
    }

    function fRemoveTask(todolistId: string, taskId: string) {
        setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter(task => task.id !== taskId) })
    }

    function fChangeTaskChekedValue(todolistId: string, taskId: string, taskValue: boolean) {
        setTasks({ ...tasks, [todolistId]: tasks[todolistId].map(task => task.id === taskId ? { ...task, isDone: taskValue } : task) })
    }

    function fChangeFilterValue(todolistId: string, value: FilterValueType) {
        setTodolists(todolists.map(tl => tl.id === todolistId ? { ...tl, filter: value } : tl));
    }

    return (
        <div className="App">
            {todolists.map((tl) => {
                return (
                    <Todolist
                        key={tl.id}
                        todolistId={tl.id}
                        title={tl.title}
                        tasks={tasks[tl.id]}
                        filter={tl.filter}
                        removeTodolist={fRemoveTodolist}
                        addTask={fAddTask}
                        removeTask={fRemoveTask}
                        changeTaskChekedValue={fChangeTaskChekedValue}
                        changeFilterValue={fChangeFilterValue}
                    />
                )
            })}
        </div>
    );
}

export default App;
