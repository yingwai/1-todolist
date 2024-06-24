import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithRedux from './AppWithRedux';
import { store } from './state/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import Todolist from './pages/Todolist/Todolist';
import { ErrorPage } from './pages/ErrorPage/ErrorPage';

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppWithRedux />,
		errorElement: <Navigate to={'/404'} />,
		children: [
			{
                index: true,
                element: <Navigate to="/todolists"/>
            },
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/todolists",
				element: <Todolist />,
			},
		],
	},
	{
		path: "/404",
		element: <ErrorPage />
	}
]);

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<Provider store={store}>
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

