import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { store } from "./state/store";
import { Provider } from "react-redux";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import AppWithSlice from "AppWithSlice";
import TodolistWithSlice from "pages/Todolist/TodolistWithSlice";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppWithSlice />,
        errorElement: <Navigate to={"/404"} />,
        children: [
            {
                index: true,
                element: <Navigate to='/todolists' />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/todolists",
                element: <TodolistWithSlice />,
            },
        ],
    },
    {
        path: "/404",
        element: <ErrorPage />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <Provider store={store}>
            <RouterProvider router={router} />
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
