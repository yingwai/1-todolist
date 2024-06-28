// import React, { ChangeEvent } from 'react';
// import { FilterValueType, TodolistType } from '../../App';
// import { TaskInStateType } from '../../AppWithRedux';
// import { AddItemForm } from '../AddItemForm';
// import { EditableSpanText } from '../EditableSpanText';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import Box from '@mui/material/Box';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppRootStateType } from '../../state/store';
// import { addTaskAC, changeTaskFilterAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from '../../state/tasks-reducer';
// import { changeTitleTodolistAC, removeTodolistAC } from '../../state/todolists-reducer';

// type TodoListPropsType = {
//     todolist: TodolistType,
// }

// export const TodolistWithRedux = ({ todolist }: TodoListPropsType) => {
//     const { id, title } = todolist
//     const tasks = useSelector<AppRootStateType, TaskInStateType>(state => state.tasks[id])
//     const dispatch = useDispatch()

//     let currentTask = tasks.data;
//     if (tasks.filter === "active") currentTask = tasks.data.filter(task => !task.isDone);
//     if (tasks.filter === "completed") currentTask = tasks.data.filter(task => task.isDone);

//     function fUpdateTitleTodolist(newTitle: string) {
//         dispatch(changeTitleTodolistAC(id, newTitle));
//     }

//     function fRemoveTodolistHandler() {
//         dispatch(removeTodolistAC(id));
//     }

//     function fAddTaskHandler(titleTask: string) {
//         // dispatch(addTaskAC(id, titleTask));
//     }

//     function fUpdateTitleTask(taskId: string, newTitle: string) {
//         dispatch(changeTaskTitleAC(id, taskId, newTitle));
//     }

//     function fChangeFilterValueHandler(value: FilterValueType) {
//         dispatch(changeTaskFilterAC(id, value));
//     }

//     return (
//         <div>
//             <div className='todolist-title'>
//                 <h3>
//                     <EditableSpanText oldTitle={title} updateTitleItem={fUpdateTitleTodolist} />
//                 </h3>
//                 <IconButton aria-label="delete" onClick={fRemoveTodolistHandler}>
//                     <DeleteIcon />
//                 </IconButton>
//             </div>
//             <AddItemForm addItem={fAddTaskHandler} />

//             {
//                 currentTask.length === 0 ?
//                     <p>Тасок нет</p> :
//                     <List>
//                         {currentTask.map(task => {
//                             function fRemoveTaskHandler() {
//                                 dispatch(removeTaskAC(id, task.id))
//                             }

//                             function fChangeTaskChekedValue(e: ChangeEvent<HTMLInputElement>) {
//                                 dispatch(changeTaskStatusAC(id, task.id, e.currentTarget.checked))
//                             }

//                             return (
//                                 <ListItem
//                                     key={task.id}
//                                     sx={{ p: '0', justifyContent: 'space-between', opacity: task.isDone ? '0.4' : "1" }}
//                                 >
//                                     <div>
//                                         <Checkbox checked={task.isDone} onChange={fChangeTaskChekedValue} />
//                                         <EditableSpanText oldTitle={task.title} updateTitleItem={(newTitle: string) => fUpdateTitleTask(task.id, newTitle)} />
//                                     </div>
//                                     <IconButton aria-label="delete" onClick={fRemoveTaskHandler}>
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </ListItem>
//                             )
//                         })}
//                     </List>
//             }

//             <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
//                 <Button
//                     variant={tasks.filter === 'all' ? 'contained' : 'outlined'}
//                     color='success'
//                     onClick={() => fChangeFilterValueHandler("all")}
//                 >
//                     All
//                 </Button>
//                 <Button
//                     variant={tasks.filter === 'active' ? 'contained' : 'outlined'}
//                     color={'primary'}
//                     onClick={() => fChangeFilterValueHandler("active")}
//                 >
//                     Active
//                 </Button>
//                 <Button
//                     variant={tasks.filter === 'completed' ? 'contained' : 'outlined'}
//                     color={'secondary'}
//                     onClick={() => fChangeFilterValueHandler("completed")}
//                 >
//                     Completed
//                 </Button>
//             </Box>
//         </div >
//     );
// };
