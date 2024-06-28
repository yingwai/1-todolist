// import React, { memo, useCallback } from 'react';
// import { FilterValueType } from '../../App';
// import { AddItemForm } from '../AddItemForm';
// import { EditableSpanText } from '../EditableSpanText';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import Box from '@mui/material/Box';
// import { Task } from '../task/Task';
// import { TasksType } from '../../App';

// type TodoListPropsType = {
//     todolistId: string,
//     todolistTitle: string,
//     tasks: TasksType[],
//     filter: FilterValueType,
//     removeTodolist: (todolistId: string) => void,
//     updateTitleTodolist: (todolistId: string, newTitle: string) => void
//     addTask: (todolistId: string, taskTitle: string) => void,
//     removeTask: (todolistId: string, taskId: string) => void,
//     updateTitleTask: (todolistId: string, taskId: string, newTitle: string) => void
//     changeTaskChekedValue: (todolistId: string, taskId: string, taskValue: boolean) => void,
//     changeFilterValue: (todolistId: string, value: FilterValueType) => void,
// }

// export const Todolist = memo((
//     { todolistId, todolistTitle, tasks, filter, removeTodolist, updateTitleTodolist, addTask, removeTask, updateTitleTask, changeTaskChekedValue, changeFilterValue }: TodoListPropsType
// ) => {
//     let currentTasks = tasks;

//     if (filter === "active") {
//         currentTasks = tasks.filter(task => !task.isDone)
//     };
//     if (filter === "completed") {
//         currentTasks = tasks.filter(task => task.isDone)
//     };

//     const fUpdateTitleTodolist = useCallback((newTitle: string) => {
//         updateTitleTodolist(todolistId, newTitle);
//     }, [todolistId, updateTitleTodolist])

//     const fAddTaskHandler = useCallback((title: string) => {
//         addTask(todolistId, title)
//     }, [addTask, todolistId])

//     const fChangeFilterValueHandler = useCallback((value: FilterValueType) => {
//         changeFilterValue(todolistId, value);
//     }, [changeFilterValue, todolistId])

//     return (
//         <div>
//             <div className='todolist-title'>
//                 <h3>
//                     <EditableSpanText oldTitle={todolistTitle} updateTitleItem={fUpdateTitleTodolist} />
//                 </h3>
//                 <IconButton aria-label="delete" onClick={() => removeTodolist(todolistId)}>
//                     <DeleteIcon />
//                 </IconButton>
//             </div>
//             <AddItemForm addItem={fAddTaskHandler} />

//             {
//                 currentTasks.length === 0 ?
//                     <p>Тасок нет</p> :
//                     <List>
//                         {currentTasks.map(task => {
//                             return (
//                                 <Task key={task.id} task={task} todolistId={todolistId} updateTitleTask={updateTitleTask} removeTask={removeTask} changeTaskChekedValue={changeTaskChekedValue} />
//                             )
//                         })}
//                     </List>
//             }

//             <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
//                 <Button
//                     variant={filter === 'all' ? 'contained' : 'outlined'}
//                     color='success'
//                     onClick={() => fChangeFilterValueHandler("all")}
//                 >
//                     All
//                 </Button>
//                 <Button
//                     variant={filter === 'active' ? 'contained' : 'outlined'}
//                     color={'primary'}
//                     onClick={() => fChangeFilterValueHandler("active")}
//                 >
//                     Active
//                 </Button>
//                 <Button
//                     variant={filter === 'completed' ? 'contained' : 'outlined'}
//                     color={'secondary'}
//                     onClick={() => fChangeFilterValueHandler("completed")}
//                 >
//                     Completed
//                 </Button>
//             </Box>
//         </div >
//     );
// });
