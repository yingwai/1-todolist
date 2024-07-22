import React, { useEffect, useState } from "react";
import "./App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Switch from "@mui/material/Switch";
import { useSelector } from "react-redux";
import { useAppDisspatch } from "./state/store";
import LinearProgress from "@mui/material/LinearProgress";
import { STATUS_CODE } from "./state/app-reducer";
import { ErrorSnackbar } from "./components/ErrorSnackbar/ErrorSnackbar";
import { Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { logout, me, selectorAuthIsLoggedIn } from "pages/Login/authSlice";
import { selectorAppInitialized, selectorAppStatus } from "state/appSlice";

type ThemeMode = "dark" | "light";

function AppWithSlice() {
    const isInitialized = useSelector(selectorAppInitialized)
    const status = useSelector(selectorAppStatus);
    const isLoggedIn = useSelector(selectorAuthIsLoggedIn);
    const dispatch = useAppDisspatch();

    const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

    useEffect(() => {
        dispatch(me());
    }, [dispatch]);

    const theme = createTheme({
        palette: {
            mode: themeMode === "light" ? "light" : "dark",
        },
    });

    const changeModeHandler = () => {
        setThemeMode(themeMode === "light" ? "dark" : "light");
    };
    
    if (!isInitialized) {
        return (
            <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <ErrorSnackbar />
                <CssBaseline />
                <AppBar position='static'>
                    <Toolbar variant='dense'>
                        <Grid
                            item
                            width={"100%"}
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            <Grid item display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant='h6' color='inherit' component='div'>
                                    Todolist
                                </Typography>
                                <Switch color={"default"} onChange={changeModeHandler} />
                            </Grid>

                            {isLoggedIn && (
                                <Button variant={"contained"} color={"inherit"} onClick={() => dispatch(logout())}>
                                    Logout
                                </Button>
                            )}
                        </Grid>
                    </Toolbar>
                    {status === STATUS_CODE.loading && <LinearProgress color='info' />}
                    {status === STATUS_CODE.failed && <LinearProgress color='error' />}
                </AppBar>

                <Container fixed>
                    <Outlet />
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default AppWithSlice;
