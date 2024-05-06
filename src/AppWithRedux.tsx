import React, { useState } from 'react';
import './App.css';
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
import { addTodolistAC } from './state/todolists-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from './state/store';
import { TodolistWithRedux } from './components/todolist/TodolistWithRedux';

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

function AppWithReducer() {
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark')

    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
        }
    })

    const changeModeHandler = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light')
    }

    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists);
    const dispatch = useDispatch()

    function fAddTodolist(tdlTitle: string) {
        dispatch(addTodolistAC(tdlTitle));
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
                                <Grid item
                                    key={tl.id}>
                                    <Paper elevation={4} sx={{ p: '0 15px 15px 15px' }}>
                                        <TodolistWithRedux
                                            key={tl.id}
                                            todolist={tl}
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

export default AppWithReducer;
