import React, { useState } from 'react';
import './App.css';
import { Todolist } from './components/todolist/Todolist';
import { v1 } from 'uuid';
import { AddItemForm } from './components/AddItemForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';

export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}

export type TasksStateType = {
    [key: string]: TaskInStateType
}

type TaskInStateType = {
    data: TasksType[],
    filter: FilterValueType
}

export type FilterValueType = 'all' | 'active' | 'completed';

export type TodolistType = {
    id: string
    title: string
}

type ThemeMode = 'dark' | 'light'

function App() {
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark')

    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
        }
    })

    const changeModeHandler = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light')
    }

    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<TodolistType[]>([
        { id: todolistID1, title: 'What to learn' },
        { id: todolistID2, title: 'What to buy' },
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: {
            data: [
                { id: v1(), title: 'HTML&CSS', isDone: true },
                { id: v1(), title: 'JS', isDone: true },
                { id: v1(), title: 'ReactJS', isDone: false },
            ],
            filter: 'all'
        },
        [todolistID2]: {
            data: [
                { id: v1(), title: 'Rest API', isDone: true },
                { id: v1(), title: 'GraphQL', isDone: false },
            ],
            filter: 'all'
        },
    })


    function fAddTodolist(tdlTitle: string) {
        // const newId = v1();

        // const newTodolist = {
        //     id: newId,
        //     title: tdlTitle,
        // }

        // setTodolists([...todolists, newTodolist]);
        // setTasks({ ...tasks, [newId]: { data: [], filter: 'all' } })
    }

    function fRemoveTodolist(todolistId: string) {
        // setTodolists(todolists.filter(tl => tl.id !== todolistId));
        // delete tasks[todolistId];
        // setTasks({ ...tasks })
    }

    function fUpdateTitleTodolist(todolistId: string, newTitle: string) {
        // setTodolists(todolists.map(tl => tl.id === todolistId ? { ...tl, title: newTitle } : tl))
    }

    function fAddTask(todolistId: string, taskTitle: string) {
        // const newTask = {
        //     id: v1(),
        //     title: taskTitle,
        //     isDone: false
        // }

        // setTasks({ ...tasks, [todolistId]: { ...tasks[todolistId], data: [newTask, ...tasks[todolistId].data] } });
    }

    function fRemoveTask(todolistId: string, taskId: string) {
        // setTasks({ ...tasks, [todolistId]: { ...tasks[todolistId], data: tasks[todolistId].data.filter(task => task.id !== taskId) } });
    }

    function fChangeTaskChekedValue(todolistId: string, taskId: string, taskValue: boolean) {
        // setTasks({ ...tasks, [todolistId]: { ...tasks[todolistId], data: tasks[todolistId].data.map(task => task.id === taskId ? { ...task, isDone: taskValue } : task) } })
    }

    function fUpdateTitleTask(todolistId: string, taskId: string, newTitle: string) {
        // setTasks({ ...tasks, [todolistId]: { ...tasks[todolistId], data: tasks[todolistId].data.map(task => task.id === taskId ? { ...task, title: newTitle } : task) } })
    }

    function fChangeFilterValue(todolistId: string, value: FilterValueType) {
        setTasks({ ...tasks, [todolistId]: { ...tasks[todolistId], filter: value } })
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" component="div">
                            Todolist
                        </Typography>
                        <Switch color={'default'} onChange={changeModeHandler} />
                    </Toolbar>
                </AppBar>

                <Container fixed>
                    <Grid container sx={{ my: '30px' }}>
                        <AddItemForm addItem={fAddTodolist} />
                    </Grid>

                    <Grid container spacing={4}>
                        {todolists.map((tl) => {
                            return (
                                <Grid item>
                                    <Paper elevation={4} sx={{ p: '0 15px 15px 15px' }}>
                                        <Todolist
                                            key={tl.id}
                                            todolistId={tl.id}
                                            todolistTitle={tl.title}
                                            tasks={tasks[tl.id].data}
                                            filter={tasks[tl.id].filter}
                                            removeTodolist={fRemoveTodolist}
                                            addTask={fAddTask}
                                            removeTask={fRemoveTask}
                                            changeTaskChekedValue={fChangeTaskChekedValue}
                                            changeFilterValue={fChangeFilterValue}
                                            updateTitleTask={fUpdateTitleTask}
                                            updateTitleTodolist={fUpdateTitleTodolist}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default App;
