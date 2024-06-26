import React, { useEffect, useState } from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';
import { useSelector } from 'react-redux';
import { AppRootStateType, useAppDisspatch } from './state/store';
import LinearProgress from '@mui/material/LinearProgress';
import { RequestStatusType, STATUS_CODE } from './state/app-reducer';
import { ErrorSnackbar } from './components/ErrorSnackbar/ErrorSnackbar';
import { Outlet } from 'react-router-dom';
import { logoutTC, meTC } from './pages/Login/auth-reducer';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

type ThemeMode = 'dark' | 'light'

function AppWithReducer() {
    const isInitialized = useSelector((state: AppRootStateType) => state.app.isInitialized);
    const status = useSelector((state: AppRootStateType) => state.app.status);
    const isLoggedIn = useSelector((state: AppRootStateType) => state.auth.isLoggedIn);
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
    const dispatch = useAppDisspatch();

    useEffect(() => {
        dispatch(meTC())
    }, [dispatch])

    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
        }
    })

    const changeModeHandler = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light')
    }

    if (!isInitialized) {
        return (
            <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <ErrorSnackbar />
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Grid item width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="h6" color="inherit" component="div">
                                    Todolist
                                </Typography>
                                <Switch color={'default'} onChange={changeModeHandler} />
                            </Grid>

                            {
                                isLoggedIn &&
                                <Button
                                    variant={'contained'}
                                    color={'inherit'}
                                    onClick={() => dispatch(logoutTC())}
                                >
                                    Logout
                                </Button>
                            }
                        </Grid>
                    </Toolbar>
                    {
                        status === STATUS_CODE.loading &&
                        <LinearProgress color='info' />
                    }
                    {
                        status === STATUS_CODE.failed &&
                        <LinearProgress color='error' />
                    }
                </AppBar>

                <Container fixed>
                    <Outlet />
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default AppWithReducer;
